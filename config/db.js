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
            `SELECT first, last, email, image
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
