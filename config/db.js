var spicedPg = require("spiced-pg");
var db = spicedPg(process.env.DATABASE_URL || "postgres:postgres:postgres@localhost:5432/socialnetwork");

exports.createUser = (first, last, email, password) => {
    return db
        .query(
            `INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
            [first || null, last || null, email || null, password || null]
        )
        .then(results => {
            return results.rows;
        });
};

exports.getUserByEmail = email => {
    return db
        .query(
            `SELECT id, password
        FROM users
        WHERE email = $1`,
            [email]
        )
        .then(results => {
            return results.rows;
        });
};

exports.getUserById = id => {
    return db
        .query(
            `SELECT id, first, last, email, image, bio
        FROM users
        WHERE id = $1`,
            [id]
        )
        .then(results => {
            return results.rows;
        });
};

exports.saveImage = (url, id) => {
    return db
        .query(
            `UPDATE users
        SET image = $1
        WHERE id = $2
        RETURNING image`,
            [url, id]
        )
        .then(results => {
            return results.rows;
        });
};

exports.updateBio = (id, bio) => {
    return db
        .query(
            `UPDATE users
        SET bio = $2
        WHERE id = $1
        RETURNING *`,
            [id, bio]
        )
        .then(results => {
            return results.rows;
        });
};

exports.getFriend = (id1, id2) => {
    return db
        .query(
            `SELECT *
        FROM friends
        WHERE (receiver = $1 AND sender = $2)
        OR (receiver = $2 AND sender = $1)`,
            [id1, id2]
        )
        .then(results => {
            return results.rows;
        });
};

exports.getFriends = id => {
    return db
        .query(
            `SELECT users.id, first, last, image, accepted
            FROM friends
            JOIN users
            ON (accepted = false AND receiver = $1 AND sender = users.id)
            OR (accepted = true AND receiver = $1 AND sender = users.id)
            OR (accepted = true AND sender = $1 AND receiver = users.id)`,
            [id]
        )
        .then(results => {
            return results.rows;
        });
};

exports.makeFriend = (receiver, sender) => {
    return db.query(
        `INSERT INTO friends (receiver, sender)
        VALUES ($1, $2)`,
        [receiver, sender]
    );
};

exports.cancelFriend = (receiver, sender) => {
    return db.query(
        `DELETE FROM friends
            WHERE (receiver = $1 AND sender = $2)`,
        [receiver, sender]
    );
};

exports.acceptFriend = (receiver, sender) => {
    return db.query(
        `UPDATE friends
            SET accepted = true
            WHERE (receiver = $1 AND sender = $2)`,
        [receiver, sender]
    );
};

exports.deleteFriend = (id1, id2) => {
    return db.query(
        `DELETE FROM friends
            WHERE (receiver = $1 AND sender = $2)
            OR (receiver = $2 AND sender = $1)`,
        [id1, id2]
    );
};

exports.searchUsersByName = input => {
    return db
        .query(
            `SELECT id, first, last, image
        FROM users
        WHERE LOWER(first) LIKE LOWER($1)
        OR LOWER(last) LIKE LOWER($1)`,
            [input + "%"]
        )
        .then(results => {
            return results.rows;
        });
};

exports.getUsersByIds = arrayOfIds => {
    const query = `SELECT id, first, last, image FROM users WHERE id = ANY($1)`;
    return db.query(query, [arrayOfIds]).then(results => {
        return results.rows;
    });
};

exports.getMessages = () => {
    const query = `SELECT sender, first, last, image, message, messages.createtime AS createtime
    FROM messages
    JOIN users
    ON users.id = messages.sender
    ORDER BY messages.createtime DESC
    LIMIT 10`;
    return db.query(query).then(results => {
        return results.rows;
    });
};

exports.createMessage = (message, sender) => {
    const query = `INSERT INTO messages(message,sender) VALUES ($1, $2) RETURNING id`;
    return db.query(query, [message, sender]).then(results => {
        return results.rows;
    });
};

exports.getMessageById = id => {
    const query = `
        SELECT sender, first, last, image, message, messages.createtime AS createtime
        FROM messages
        JOIN users
        ON users.id = messages.sender
        WHERE messages.id = $1
        ORDER BY messages.createtime DESC`;
    return db.query(query, [id]).then(results => {
        return results.rows;
    });
};
