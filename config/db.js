var spicedPg = require("spiced-pg");
var db = spicedPg(process.env.DATABASE_URL || "postgres:postgres:postgres@localhost:5432/socialnetwork");

exports.createUser = async (first, last, email, password) => {
    const query = `
    INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `;
    const { rows } = await db.query(query, [first || null, last || null, email || null, password || null]);
    return rows;
};

exports.getUserByEmail = async email => {
    const query = `SELECT id, password FROM users WHERE email = $1`;
    const { rows } = await db.query(query, [email]);
    return rows;
};

exports.getUserById = async id => {
    const query = `SELECT id, first, last, email, image, bio FROM users WHERE id = $1`;
    const { rows } = await db.query(query, [id]);
    return rows;
};

exports.saveImage = async (url, id) => {
    const query = `
    UPDATE users
    SET image = $1
    WHERE id = $2
    RETURNING image
    `;
    const { rows } = await db.query(query, [url, id]);
    return rows;
};

exports.updateBio = async (id, bio) => {
    const query = `
    UPDATE users
    SET bio = $2
    WHERE id = $1
    RETURNING *
    `;
    const { rows } = await db.query(query, [id, bio]);
    return rows;
};

exports.getFriend = async (id1, id2) => {
    const query = `
    SELECT *
    FROM friends
    WHERE (receiver = $1 AND sender = $2)
    OR (receiver = $2 AND sender = $1)
    `;
    const { rows } = await db.query(query, [id1, id2]);
    return rows;
};

exports.getFriends = async id => {
    const query = `
    SELECT users.id, first, last, image, accepted
    FROM friends
    JOIN users
    ON (accepted = false AND receiver = $1 AND sender = users.id)
    OR (accepted = true AND receiver = $1 AND sender = users.id)
    OR (accepted = true AND sender = $1 AND receiver = users.id)
    `;
    const { rows } = await db.query(query, [id]);
    return rows;
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

exports.searchUsersByName = async input => {
    const query = `
    SELECT id, first, last, image
    FROM users
    WHERE LOWER(first) LIKE LOWER($1)
    OR LOWER(last) LIKE LOWER($1)
    `;
    const { rows } = await db.query(query, [input + "%"]);
    return rows;
};

exports.getUsersByIds = async arrayOfIds => {
    const query = `SELECT id, first, last, image FROM users WHERE id = ANY($1)`;
    const { rows } = await db.query(query, [arrayOfIds]);
    return rows;
};

exports.getMessages = async () => {
    const query = `
    SELECT sender, first, last, image, message, messages.createtime AS createtime
    FROM messages
    JOIN users
    ON users.id = messages.sender
    ORDER BY messages.createtime DESC
    LIMIT 10
    `;
    const { rows } = await db.query(query);
    return rows;
};

exports.createMessage = async (message, sender) => {
    const query = `INSERT INTO messages(message,sender) VALUES ($1, $2) RETURNING id`;
    const { rows } = await db.query(query, [message, sender]);
    return rows;
};

exports.getMessageById = async id => {
    const query = `
    SELECT sender, first, last, image, message, messages.createtime AS createtime
    FROM messages
    JOIN users
    ON users.id = messages.sender
    WHERE messages.id = $1
    ORDER BY messages.createtime DESC
    `;
    const { rows } = await db.query(query, [id]);
    return rows;
};

exports.getOpenFriendRequests = async id => {
    const query = `SELECT * FROM friends WHERE receiver = $1 AND accepted = false`;
    const { rows } = await db.query(query, [id]);
    return rows;
};
