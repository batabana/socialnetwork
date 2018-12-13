import React from "react";
import { Link } from "react-router-dom";

export default function NoMatch() {
    return (
        <div className="no-match-container">
            <h1>We couldn{"'"}t find anything here :(</h1>
            <p>
                <Link to="/">Redirect to your profile instead?</Link>
            </p>
            <img src="/no_match.jpg" />
        </div>
    );
}
