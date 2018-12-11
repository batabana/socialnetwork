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

        axios.post("/registration", this.state).then(({ data }) => {
            data.success ? location.replace("/") : this.setState({ error: data.err });
        });
    }

    render() {
        const { first, last, email, password } = this.state;
        const isEnabled = first.length > 0 && last.length > 0 && email.length > 0 && password.length > 0;

        return (
            <div className="registration-container">
                <form onSubmit={this.handleSubmit}>
                    <h1>Sign up</h1>
                    {this.state.error && <p className="error">{this.state.error}</p>}
                    <input onChange={this.handleChange} name="first" type="text" placeholder="first name" />
                    <input onChange={this.handleChange} name="last" type="text" placeholder="last name" />
                    <input onChange={this.handleChange} name="email" type="email" placeholder="email address" />
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
