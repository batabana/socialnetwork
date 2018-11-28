import React from "react";
import axios from "axios";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.first) {
            return this.setState({ firstError: true });
        }
        if (!this.state.last) {
            return this.setState({ lastError: true });
        }
        if (!this.state.email) {
            return this.setState({ emailError: true });
        }
        if (!this.state.password) {
            return this.setState({ passwordError: true });
        }
        axios.post("/registration", this.state).then(resp => {
            if (resp.data.success) {
                this.setState({
                    error: false
                });
                location.replace("/");
            } else {
                this.setState({
                    error: true
                });
            }
        });
    }

    render() {
        return (
            <div className="registration-container">
                <h1>Join us</h1>
                {this.state.error && <p className="error">Something went wrong, please try again.</p>}
                <form onSubmit={this.handleSubmit}>
                    <input onChange={this.handleChange} name="first" type="text" placeholder="first name" />
                    {this.state.firstError && <p className="error">Please provide a first name.</p>}
                    <input onChange={this.handleChange} name="last" type="text" placeholder="last name" />
                    {this.state.firstError && <p className="error">Please provide a last name.</p>}
                    <input onChange={this.handleChange} name="email" type="text" placeholder="email address" />
                    {this.state.firstError && <p className="error">Please provide an email address.</p>}
                    <input onChange={this.handleChange} name="password" type="password" placeholder="password" />
                    {this.state.firstError && <p className="error">Please provide a password.</p>}
                    <button>Register</button>
                </form>
                <p>
                    If you already have an account, please <a href="#">sign in</a>.
                </p>
            </div>
        );
    }
}
