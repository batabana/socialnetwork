import React from "react";
import Registration from "./registration";

export default function Welcome() {
    return (
        <div className="welcome-container">
            <img src="/logo.png" alt="logo" id="startlogo" />
            <Registration />
        </div>
    );
}
