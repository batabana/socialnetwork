import React from "react";
import axios from "./axios";

export default class Search extends React.Component {
    constructor() {
        super();
        this.state = {
            suggestions: []
        };
        this.handleChange = this.handleChange.bind(this);
    }

    async handleChange(e) {
        await this.setState({
            [e.target.name]: e.target.value
        });
        const { data } = await axios.get("/api/search/" + this.state.searchinput);
        this.setState({
            suggestions: data
        });
    }

    render() {
        const { suggestions } = this.state;
        if (!suggestions) {
            return null;
        }
        return (
            <div className="search-container">
                <h1>Search</h1>
                <input onChange={this.handleChange} type="text" name="searchinput" />
                {suggestions.map(user => {
                    return (
                        <div key={user.id}>
                            <div className="friend">
                                <a href={"/user/" + user.id}>
                                    {user.first} {user.last}
                                </a>
                            </div>
                        </div>
                    );
                })}
                {this.state.suggestions && <div className="suggestions" />}
            </div>
        );
    }
}
