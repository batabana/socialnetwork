import React from "react";
import axios from "./axios";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false
        };
        this.showUploader = this.showUploader.bind(this);
    }

    showUploader() {
        this.setState(
            {
                uploaderIsVisible: true
            },
            () => console.log("state showUploader", this.state)
        );
    }

    componentDidMount() {
        // destructuring also works directly in the callback
        axios.get("/user").then(({ data }) => {
            console.log("data in getUsers", data);
            this.setState(data, () => {
                console.log("this.state in then", this.state);
            });
        });
    }

    render() {
        return (
            <div>
                <Logo />
                <a href="/logout" id="logout">
                    Logout
                </a>
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    profilePicUrl={this.state.image}
                    showUploader={this.showUploader}
                />
                {this.state.uploaderIsVisible && <Uploader />}
            </div>
        );
    }
}
