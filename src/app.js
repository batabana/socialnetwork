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
        this.hideUploader = this.hideUploader.bind(this);
        this.updateImage = this.updateImage.bind(this);
    }

    showUploader() {
        this.setState({
            uploaderIsVisible: true
        });
    }

    hideUploader() {
        this.setState({
            uploaderIsVisible: false
        });
    }

    updateImage(url) {
        this.setState({
            image: url
        });
    }

    componentDidMount() {
        // destructuring also works directly in the callback
        axios.get("/user").then(({ data }) => {
            this.setState(data);
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
                    profilePicUrl={this.state.image ? this.state.image : "/default.jpg"}
                    showUploader={this.showUploader}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader hideUploader={this.hideUploader} updateImage={this.updateImage} />
                )}
            </div>
        );
    }
}
