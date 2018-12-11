DROP TABLE IF EXISTS messages;

CREATE TABLE messages(
    id SERIAL PRIMARY KEY,
    message TEXT,
    sender INTEGER NOT NULL REFERENCES users(id),
    createtime TIMESTAMP DEFAULT current_timestamp
);
