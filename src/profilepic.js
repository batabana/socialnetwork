import React from "react";

export default function ProfilePic(props) {
    // console.log("props", props);
    return (
        <div className="profile-pic-container">
            <img
                onClick={props.showUploader}
                src={props.profilePicUrl}
                alt={`${props.first} ${props.last}`}
                id="profile-pic"
            />
        </div>
    );
}
