import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default class Bio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditor: false
        };
        this.showEditor = this.showEditor.bind(this);
        this.hideEditor = this.hideEditor.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    showEditor(e) {
        e.preventDefault();
        this.setState({
            bio: this.props.bio,
            showEditor: true
        });
    }

    hideEditor() {
        this.setState({
            showEditor: false
        });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const self = this;
        axios
            .post("/api/editbio", this.state)
            .then(resp => {
                self.props.setBio(resp.data[0].bio);
                self.hideEditor();
            })
            .catch(err => console.log("error while saving bio: ", err));
    }

    render() {
        return (
            <div className="bio-container">
                {this.state.showEditor ? (
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <textarea defaultValue={this.props.bio} onChange={this.handleChange} name="bio" />
                            <button>save</button>
                        </form>
                        <button onClick={this.hideEditor}>cancel</button>
                    </div>
                ) : (
                    <div>
                        {this.props.bio ? (
                            <div>
                                {this.props.bio}{" "}
                                <Link onClick={this.showEditor} to="/">
                                    Edit
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <Link onClick={this.showEditor} to="/">
                                    Say something about yourself
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}
