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
            `SELECT first, last, email, image, bio
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

exports.makeFriend = (receiver, sender) => {
    return db
        .query(
            `INSERT INTO friends (receiver, sender)
        VALUES ($1, $2)
        RETURNING *`,
            [receiver, sender]
        )
        .then(results => {
            return results.rows;
        });
};

exports.cancelFriend = (receiver, sender) => {
    return db
        .query(
            `DELETE FROM friends
            WHERE (receiver = $1 AND sender = $2)
            RETURNING *`,
            [receiver, sender]
        )
        .then(results => {
            return results.rows;
        });
};

exports.acceptFriend = (receiver, sender) => {
    return db
        .query(
            `UPDATE friends
            SET accepted = true
            WHERE (receiver = $1 AND sender = $2)
            RETURNING *`,
            [receiver, sender]
        )
        .then(results => {
            return results.rows;
        });
};

exports.deleteFriend = (id1, id2) => {
    return db
        .query(
            `DELETE FROM friends
            WHERE (receiver = $1 AND sender = $2)
            OR (receiver = $2 AND sender = $1)
            RETURNING *`,
            [id1, id2]
        )
        .then(results => {
            return results.rows;
        });
};
