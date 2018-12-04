import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import FriendButton from "./friendbutton";

export default class OtherPersonProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        axios.get("/api/user/" + this.props.match.params.id).then(({ data }) => {
            if (data.success) {
                data.results ? this.setState(data.results) : this.props.history.push("/");
            } else {
                this.props.history.push("/");
            }
        });
    }

    render() {
        return (
            <div className="opp-container">
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    profilePicUrl={this.state.image || "/default.jpg"}
                />
                <h1>
                    {this.state.first} {this.state.last}
                </h1>
                <p>{this.state.bio}</p>
                <FriendButton otherUserId={this.props.match.params.id} />
            </div>
        );
    }
}
