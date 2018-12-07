import React from "react";

export default function ProfilePic(props) {
    return (
        <div className="profile-pic-container">
            <img
                onClick={props.toggleNav}
                src={props.profilePicUrl}
                alt={`${props.first} ${props.last}`}
                className="profile-pic"
            />
        </div>
    );
}
