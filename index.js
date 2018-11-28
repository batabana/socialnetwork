const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const bcrypt = require("./config/bcrypt.js");
const db = require("./config/db.js");

// setup bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// setup middleware to parse cookies
if (!process.env.COOKIE_SECRET) {
    var secrets = require("./config/secrets.json");
}
const cookieSession = require("cookie-session");
app.use(
    cookieSession({
        secret: process.env.COOKIE_SECRET || secrets.cookieSecret,
        // delete after 2hr
        maxAge: 1000 * 60 * 60 * 2
    })
);

// serve static files
app.use(express.static("./public"));

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
    if (password != "") {
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
                res.json({ success: false });
                console.log("Error in POST /registration: ", err);
            });
    } else {
        console.log("no password provided");
    }
});

app.get("/logout", function(req, res) {
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
app.get("*", function(req, res) {
    if (!req.session.userId && req.url != "/welcome") {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, "127.0.0.1", () => console.log("Listening."));
