DROP TABLE IF EXISTS friends;

CREATE TABLE friends(
    id SERIAL PRIMARY KEY,
    receiver INTEGER NOT NULL REFERENCES users(id),
    sender INTEGER NOT NULL REFERENCES users(id),
    accepted BOOLEAN DEFAULT false,
    createtime TIMESTAMP DEFAULT current_timestamp
);
