import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

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

        const { first, last, email, password } = this.state;
        if (!first || !last || !email || !password) {
            if (!first) this.setState({ firstError: true });
            if (!last) this.setState({ lastError: true });
            if (!email) this.setState({ emailError: true });
            if (!password) this.setState({ passwordError: true });
            return;
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
                <h1>Sign up</h1>
                {this.state.error && <p className="error">Something went wrong, please try again.</p>}
                <form onSubmit={this.handleSubmit}>
                    <input onChange={this.handleChange} name="first" type="text" placeholder="first name" className={this.state.firstError ? "error" : null} />
                    <input onChange={this.handleChange} name="last" type="text" placeholder="last name" className={this.state.lastError ? "error" : null} />
                    <input onChange={this.handleChange} name="email" type="text" placeholder="email address" className={this.state.emailError ? "error" : null} />
                    <input onChange={this.handleChange} name="password" type="password" placeholder="password" className={this.state.passwordError ? "error" : null} />
                    <button>Register</button>
                </form>
                <p>
                    If you already have an account, please <Link to="/login">sign in</Link>.
                </p>
            </div>
        );
    }
}