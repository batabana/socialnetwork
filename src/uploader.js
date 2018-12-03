import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
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
            .then(resp => {
                self.props.updateImage(resp.data[0].image);
                self.props.hideUploader();
            })
            .catch(err => {
                this.setState({ error: true });
                console.log("error while uploading image: ", err);
            });
    }

    componentDidMount() {
        // document.body.classList.add("blurry");
    }

    render() {
        return (
            <div className="uploader">
                <header>
                    <h3>update profile picture</h3>
                    <img src="/cross.svg" onClick={this.props.hideUploader} className="close-icon" />
                </header>
                {this.state.error && <p className="error">Something went wrong, please try again.</p>}
                <form onSubmit={this.handleSubmit}>
                    <input name="file" onChange={this.handleChange} type="file" accept="image/*" />
                    <button>upload</button>
                </form>
            </div>
        );
    }
}
