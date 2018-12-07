import React from "react";
// import axios from "./axios";
import { connect } from "react-redux";
import { searchUsers } from "./actions";

class Search extends React.Component {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
    }

    async handleChange(e) {
        this.props.dispatch(searchUsers(e.target.value));
    }

    render() {
        const { suggestions } = this.props;
        return (
            <div className="search-container">
                <h1>Search</h1>
                <input onChange={this.handleChange} type="text" name="searchinput" />
                {suggestions &&
                    suggestions.map(user => {
                        return (
                            <div className="result" key={user.id}>
                                <a href={"/user/" + user.id}>
                                    {user.first} {user.last}
                                </a>
                            </div>
                        );
                    })}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        suggestions: state.suggestions
    };
};

export default connect(mapStateToProps)(Search);
