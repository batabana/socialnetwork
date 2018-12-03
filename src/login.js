import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = { email: "", password: "" };
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
        const { email, password } = this.state;
        const isEnabled = email.length > 0 && password.length > 0;

        return (
            <div className="login-container">
                <h1>Sign in</h1>
                {this.state.error && <p className="error">Something went wrong, please try again.</p>}
                <form onSubmit={this.handleSubmit}>
                    <input onChange={this.handleChange} name="email" type="text" placeholder="email address" />
                    <input onChange={this.handleChange} name="password" type="password" placeholder="password" />
                    <button disabled={!isEnabled}>Login</button>
                </form>
                <p>
                    If you don{"'"}t have an account yet, please <Link to="/">sign up</Link>.
                </p>
            </div>
        );
    }
}
