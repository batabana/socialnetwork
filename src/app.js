import React from "react";
import axios from "./axios";
import Logo from "./logo";
import Profile from "./profile";
import OtherPersonProfile from "./otherpersonprofile";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import { BrowserRouter, Route } from "react-router-dom";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false
        };
        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.updateImage = this.updateImage.bind(this);
        this.setBio = this.setBio.bind(this);
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

    setBio(bio) {
        this.setState({
            bio: bio
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
                <header className="main-header">
                    <Logo />
                    <ProfilePic
                        first={this.state.first}
                        last={this.state.last}
                        profilePicUrl={this.state.image ? this.state.image : "/default.jpg"}
                        showUploader={this.showUploader}
                    />
                </header>
                <BrowserRouter>
                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                    image={this.state.image}
                                    bio={this.state.bio}
                                    setBio={this.setBio}
                                    showUploader={this.showUploader}
                                />
                            )}
                        />
                        <Route path="/user/:id" component={OtherPersonProfile} />
                    </div>
                </BrowserRouter>
                <a href="/logout" id="logout">
                    Logout
                </a>
                {this.state.uploaderIsVisible && (
                    <div>
                        <div className="uploader-background" />
                        <Uploader hideUploader={this.hideUploader} updateImage={this.updateImage} />
                    </div>
                )}
            </div>
        );
    }
}
