import React from "react";
import axios from "./axios";
import Logo from "./logo";
import Profile from "./profile";
import OtherPersonProfile from "./otherpersonprofile";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import { BrowserRouter, Route } from "react-router-dom";
import Friends from "./friends";
import Nav from "./nav";
import Search from "./search";
import OnlineUsers from "./onlinefriends";
import Chat from "./chat";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
            navIsVisible: false
        };
        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.toggleNav = this.toggleNav.bind(this);
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

    toggleNav() {
        this.setState({
            navIsVisible: !this.state.navIsVisible
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
                        profilePicUrl={this.state.image || "/default.jpg"}
                        showUploader={this.showUploader}
                        toggleNav={this.toggleNav}
                    />
                </header>
                <BrowserRouter>
                    <div className="main-container">
                        <div className="dummy" />
                        <div className="content-container">
                            {this.state.navIsVisible && (
                                <Nav showUploader={this.showUploader} toggleNav={this.toggleNav} />
                            )}
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
                            <Route path="/friends" component={Friends} />
                            <Route path="/search" component={Search} />
                            <Route path="/online" component={OnlineUsers} />
                            <Route path="/chat" component={Chat} />
                        </div>
                        <div className="dummy" />
                    </div>
                </BrowserRouter>
                {this.state.uploaderIsVisible && (
                    <div>
                        <div className="uploader-background" onClick={this.hideUploader} />
                        <Uploader hideUploader={this.hideUploader} updateImage={this.updateImage} />
                    </div>
                )}
            </div>
        );
    }
}
