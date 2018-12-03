import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = { first: "", last: "", email: "", password: "" };
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
        const { first, last, email, password } = this.state;
        const isEnabled = first.length > 0 && last.length > 0 && email.length > 0 && password.length > 0;

        return (
            <div className="registration-container">
                <h1>Sign up</h1>
                {this.state.error && <p className="error">Something went wrong, please try again.</p>}
                <form onSubmit={this.handleSubmit}>
                    <input onChange={this.handleChange} name="first" type="text" placeholder="first name" />
                    <input onChange={this.handleChange} name="last" type="text" placeholder="last name" />
                    <input onChange={this.handleChange} name="email" type="text" placeholder="email address" />
                    <input onChange={this.handleChange} name="password" type="password" placeholder="password" />
                    <button disabled={!isEnabled}>Register</button>
                </form>
                <p>
                    If you already have an account, please <Link to="/login">sign in</Link>.
                </p>
            </div>
        );
    }
}
