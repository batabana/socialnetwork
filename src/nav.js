import React from "react";
import { Link } from "react-router-dom";
// <Link to="/logout">Logout</Link>

export default function Nav(props) {
    return (
        <div className="nav" onClick={props.toggleNav}>
            <Link to="/">View own profile</Link>
            <span className="fake-link" onClick={props.showUploader}>
                Change profile picture
            </span>
            <Link to="/online">View online users</Link>
            <Link to="/search">Search people</Link>
            <Link to="/friends">View friends</Link>
            <Link to="/chat">Chat</Link>
            <a href="/logout">Logout</a>
        </div>
    );
}
