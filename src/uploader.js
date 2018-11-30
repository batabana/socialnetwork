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
            file: e.target.files[0]
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        // get file from form
        var formData = new FormData();
        formData.append("file", this.state.file);
        axios
            .post("/upload", formData)
            .then(function(resp) {
                // self.images.unshift(resp.data.rows[0]);
                // document.getElementById("uploadFile").value = "";
                console.log("resp in uploadPic", resp);
            })
            .catch(err => {
                console.log("error while uploading image: ", err);
            });

        // form data
        // post /upload request to server
        // then of axios.post: close uploader-component (go to App and tell it to set uploaderIsVisible to false), show new Image instantly (go to App and tell it to change profilePicUrl)
    }

    render() {
        return (
            <div>
                <h1>upload a new image</h1>
                <form onSubmit={this.handleSubmit}>
                    <input name="file" onChange={this.handleChange} type="file" accept="image/*" />
                    <button>upload</button>
                </form>
            </div>
        );
    }
}
