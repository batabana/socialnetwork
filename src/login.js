import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
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

        const { email, password } = this.state;
        if (!email || !password) {
            if (!email) this.setState({ emailError: true });
            if (!password) this.setState({ passwordError: true });
            return;
        }

        axios.post("/login", this.state).then(resp => {
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
            <div className="login-container">
                <h1>Sign in</h1>
                {this.state.error && <p className="error">Something went wrong, please try again.</p>}
                <form onSubmit={this.handleSubmit}>
                    <input onChange={this.handleChange} name="email" type="text" placeholder="email address" className={this.state.emailError ? "error" : null} />
                    <input onChange={this.handleChange} name="password" type="password" placeholder="password" className={this.state.passwordError ? "error" : null} />
                    <button>Login</button>
                </form>
                <p>
                    If you don{"'"}t have an account yet, please <Link to="/">sign up</Link>.
                </p>
            </div>
        );
    }
}
