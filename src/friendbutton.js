import React from "react";
import axios from "./axios";

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText: ""
        };
        this.handleClick = this.handleClick.bind(this);
        this.rejectRequest = this.rejectRequest.bind(this);
    }

    componentDidMount() {
        var self = this;
        axios.get("/api/friend/" + this.props.otherUserId).then(({ data }) => {
            if (data.length) {
                if (data[0].accepted) {
                    self.setState({
                        clickAction: "deleteFriend",
                        buttonText: "End Friendship"
                    });
                } else {
                    if (self.props.otherUserId == data[0].receiver) {
                        self.setState({
                            clickAction: "cancelFriend",
                            buttonText: "Cancel Friend Request"
                        });
                    } else {
                        self.setState({
                            clickAction: "acceptFriend",
                            buttonText: "Accept Friend Request"
                        });
                    }
                }
            } else {
                self.setState({
                    clickAction: "makeFriend",
                    buttonText: "Make Friend Request"
                });
            }
        });
    }

    handleClick(e) {
        e.preventDefault();
        if (this.state.clickAction == "makeFriend") {
            let self = this;
            return axios.post("/api/makeFriend/" + this.props.otherUserId).then(({ data }) => {
                data.success &&
                    self.setState({
                        clickAction: "cancelFriend",
                        buttonText: "Cancel Friend Request"
                    });
            });
        }
        if (this.state.clickAction == "cancelFriend") {
            let self = this;
            return axios.post("/api/cancelFriend/" + this.props.otherUserId).then(({ data }) => {
                data.success &&
                    self.setState({
                        clickAction: "makeFriend",
                        buttonText: "Make Friend Request"
                    });
            });
        }
        if (this.state.clickAction == "acceptFriend") {
            let self = this;
            return axios.post("/api/acceptFriend/" + this.props.otherUserId).then(({ data }) => {
                data.success &&
                    self.setState({
                        clickAction: "deleteFriend",
                        buttonText: "End Friendship"
                    });
            });
        }
        if (this.state.clickAction == "deleteFriend") {
            let self = this;
            return axios.post("/api/deleteFriend/" + this.props.otherUserId).then(({ data }) => {
                data.success &&
                    self.setState({
                        clickAction: "makeFriend",
                        buttonText: "Make Friend Request"
                    });
            });
        }
    }

    rejectRequest() {
        let self = this;
        return axios.post("/api/rejectFriend/" + this.props.otherUserId).then(({ data }) => {
            data.success &&
                self.setState({
                    clickAction: "makeFriend",
                    buttonText: "Make Friend Request"
                });
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.handleClick}>{this.state.buttonText}</button>
                {this.state.clickAction == "acceptFriend" && (
                    <button onClick={this.rejectRequest}>Reject Friend Request</button>
                )}
            </div>
        );
    }
}
