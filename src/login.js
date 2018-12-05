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
        axios.post("/login", this.state).then(({ data }) => {
            data.success ? location.replace("/") : this.setState({ error: data.err });
        });
    }

    render() {
        const { email, password } = this.state;
        const isEnabled = email.length > 0 && password.length > 0;

        return (
            <div className="login-container">
                <h1>Sign in</h1>
                {this.state.error && <p className="error">{this.state.error}</p>}
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
