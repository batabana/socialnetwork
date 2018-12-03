import React from "react";
import ProfilePic from "./profilepic";
import Bio from "./bio";

export default function Profile(props) {
    return (
        <div className="profile-container">
            <ProfilePic
                first={props.first}
                last={props.last}
                profilePicUrl={props.image || "/default.jpg"}
                showUploader={props.showUploader}
            />
            <h1>
                {props.first} {props.last}
            </h1>
            <Bio bio={props.bio} setBio={props.setBio} />
        </div>
    );
}
