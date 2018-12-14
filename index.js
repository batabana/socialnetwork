const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080 127.0.0.1:8080" });
const compression = require("compression");
const bodyParser = require("body-parser");
const bcrypt = require("./config/bcrypt.js");
const db = require("./config/db.js");
const csurf = require("csurf");
const moment = require("moment");

// file upload requirements
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./config/s3.js");
const config = require("./config/config.json");

// setup bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// setup middleware to parse cookies
if (!process.env.COOKIE_SECRET) {
    var secrets = require("./config/secrets.json");
}
const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: process.env.COOKIE_SECRET || secrets.cookieSecret,
    maxAge: 1000 * 60 * 60 * 2
});
app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

// setup middleware to prevent csrf-attack
app.use(csurf());
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

// set up file uploading
const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

// serve static files
app.use(express.static("./public"));
app.use(express.static("./uploads"));

// setup compression
app.use(compression());

// request for /bundle.js: serve 8081 in development | serve bundle.js that was created by webpack in production
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

// routes
app.post("/registration", (req, res) => {
    const { first, last, email, password } = req.body;
    bcrypt
        .hash(password)
        .then(hash => {
            return db.createUser(first, last, email, hash);
        })
        .then(results => {
            req.session.userId = results[0].id;
            res.json({ success: true });
        })
        .catch(err => {
            res.json({ success: false, err: "Email address is already used." });
            console.log("Error in POST /registration: ", err);
        });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    db.getUserByEmail(email)
        .then(results => {
            req.session.userId = results[0].id;
            return bcrypt.compare(password, results[0].password);
        })
        .then(doesmatch => {
            if (doesmatch) {
                res.json({ success: true });
            } else {
                delete req.session.userId;
                res.json({ success: false, err: "Wrong password, please try again." });
            }
        })
        .catch(err => {
            delete req.session.userId;
            console.log("Error in POST /login: ", err);
            res.json({ success: false, err: "User unknown, please try again." });
        });
});

app.get("/user", (req, res) => {
    db.getUserById(req.session.userId)
        .then(results => res.json(results[0]))
        .catch(err => console.log("Error in GET /user: ", err));
});

app.get("/api/user/:id", (req, res) => {
    if (req.params.id == req.session.userId) {
        return res.redirect("/");
    }
    db.getUserById(req.params.id)
        .then(results =>
            res.json({
                results: results[0],
                success: true
            })
        )
        .catch(err => {
            res.json({ success: false });
            console.log("Error in GET /api/user/id: ", err);
        });
});

app.get("/api/friend/:id", (req, res) => {
    db.getFriend(req.params.id, req.session.userId)
        .then(results => res.json(results))
        .catch(err => {
            res.json({ success: false });
            console.log("Error in GET /api/friend/id: ", err);
        });
});

app.get("/api/friends", (req, res) => {
    db.getFriends(req.session.userId)
        .then(results => res.json(results))
        .catch(err => {
            res.json({ success: false });
            console.log("Error in GET /api/friends: ", err);
        });
});

app.get("/api/search/:input", (req, res) => {
    db.searchUsersByName(req.params.input)
        .then(results => res.json(results))
        .catch(err => {
            res.json({ success: false });
            console.log("Error in GET /api/search: ", err);
        });
});

app.post("/api/makeFriend/:id", (req, res) => {
    db.makeFriend(req.params.id, req.session.userId)
        .then(() => res.json({ success: true }))
        .catch(err => {
            res.json({ success: false });
            console.log("Error in POST /api/makeFriend/id: ", err);
        });
});

app.post("/api/cancelFriend/:id", (req, res) => {
    db.cancelFriend(req.params.id, req.session.userId)
        .then(() => res.json({ success: true }))
        .catch(err => {
            res.json({ success: false });
            console.log("Error in POST /api/cancelFriend/id: ", err);
        });
});

app.post("/api/acceptFriend/:id", (req, res) => {
    db.acceptFriend(req.session.userId, req.params.id)
        .then(() => res.json({ success: true }))
        .catch(err => {
            res.json({ success: false });
            console.log("Error in POST /api/acceptFriend/id: ", err);
        });
});

app.post("/api/rejectFriend/:id", (req, res) => {
    db.cancelFriend(req.session.userId, req.params.id)
        .then(() => res.json({ success: true }))
        .catch(err => {
            res.json({ success: false });
            console.log("Error in POST /api/rejectFriend/id: ", err);
        });
});

app.post("/api/deleteFriend/:id", (req, res) => {
    db.deleteFriend(req.session.userId, req.params.id)
        .then(() => res.json({ success: true }))
        .catch(err => {
            res.json({ success: false });
            console.log("Error in POST /api/deleteFriend/id: ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    if (req.file) {
        const url = config.s3Url + req.file.filename;
        db.saveImage(url, req.session.userId)
            .then(results => {
                res.json(results);
            })
            .catch(err => {
                console.log("error in saveImage: ", err);
                res.json({ success: false });
            });
    } else {
        res.json({
            success: false
        });
    }
});

app.post("/api/editbio", (req, res) => {
    const { bio } = req.body;
    db.updateBio(req.session.userId, bio)
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            console.log("Error in POST /api/editbio: ", err);
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

// if not logged in: serve index.html
app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

// all other urls, if logged in: serve index.html
app.get("*", (req, res) => {
    if (!req.session.userId && req.url != "/welcome") {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, "127.0.0.1", () => console.log("Listening."));

// empty object, will be filled with pairs of {sockerId: userId}
let onlineUsers = {};

// listens for connect event (new users logs in or refreshes the page)
// socket object in properties will be the one sending/receiving messages to/from the frontend
io.on("connection", async socket => {
    // req.session.userId
    let userId = socket.request.session.userId;
    let socketId = socket.id;

    // if new user: inform others about it
    if (!Object.values(onlineUsers).includes(userId)) {
        db.getUserById(userId)
            .then(results => socket.broadcast.emit("userJoined", results))
            .catch(err => console.log("Error in socket userJoined: ", err));
    }

    // if disconnect + last socket with user id: inform everyone about it
    socket.on("disconnect", () => {
        if (Object.values(onlineUsers).filter(id => id == userId).length < 2) {
            io.sockets.emit("userLeft", userId);
        }
        delete onlineUsers[socketId];
    });

    // new connection: send onlineUsers to newly connected user
    onlineUsers[socketId] = userId;
    db.getUsersByIds(Object.values(onlineUsers))
        .then(results => socket.emit("onlineUsers", results))
        .catch(err => console.log("Error in socket onlineUsers: ", err));

    // new connection: send latestMessages to newly connected user
    db.getMessages()
        .then(results => {
            results.map(item => {
                item.createtime_rel = moment(item.createtime).fromNow();
                return item;
            });
            socket.emit("latestMessages", results.reverse());
        })
        .catch(err => console.log("Error in socket latestMessages: ", err));

    // on chatMessage from frontend: save to db, get remaining data, send back
    socket.on("newMessage", msg => {
        db.createMessage(msg, userId)
            .then(results => {
                db.getMessageById(results[0].id).then(results => {
                    results[0].message = msg;
                    results[0].createtime_rel = moment(results[0].createtime).fromNow();
                    io.sockets.emit("messageObj", results);
                });
            })
            .catch(err => console.log("Error in socket newMessage: ", err));
    });

    // new connection: check for open friend requests
    try {
        const openRequests = await db.getOpenFriendRequests(userId);
        openRequests.length && socket.emit("openRequests", true);
    } catch (err) {
        console.log("Error in socket openRequests: ", err);
    }

    // react to changed friend requests
    socket.on("changedFriendsRequests", async id => {
        let emitId;
        // check if receiver is me or some other person
        // id is a string, needs to be parsed as integer
        emitId = id ? parseInt(id) : userId;
        if (Object.values(onlineUsers).includes(emitId)) {
            for (let user in onlineUsers) {
                if (onlineUsers[user] == emitId) {
                    try {
                        const openRequests = await db.getOpenFriendRequests(emitId);
                        let requestsLeft = openRequests.length ? true : false;
                        io.to(user).emit("openRequests", requestsLeft);
                    } catch (err) {
                        console.log("Error in socket on changedFriendsRequests: ", err);
                    }
                }
            }
        }
    });
});
