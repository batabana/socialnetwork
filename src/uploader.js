import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.files[0]
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        // get file from form
        var formData = new FormData();
        formData.append("file", this.state.file);

        var self = this;
        axios
            .post("/upload", formData)
            .then(function(resp) {
                self.props.updateImage(resp.data[0].image);
                self.props.hideUploader();
            })
            .catch(err => {
                console.log("error while uploading image: ", err);
            });
    }

    render() {
        return (
            <div className="uploader">
                <h1>upload a new image</h1>
                <p onClick={this.props.hideUploader}>x</p>
                <form onSubmit={this.handleSubmit}>
                    <input name="file" onChange={this.handleChange} type="file" accept="image/*" />
                    <button>upload</button>
                </form>
            </div>
        );
    }
}
