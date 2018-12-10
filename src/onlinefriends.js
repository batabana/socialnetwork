import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class OnlineUsers extends React.Component {
    constructor() {
        super();
    }

    render() {
        if (!this.props.onlineUsers) {
            return null;
        }
        return (
            <div className="friends-container">
                <h1>Online Users</h1>
                <div className="friendslist">
                    {this.props.onlineUsers.map(item => {
                        return (
                            <div key={item.id}>
                                <Link to={"/user/" + item.id}>
                                    <img src={item.image || "/default.jpg"} />
                                </Link>
                                <div className="friend">
                                    <h4>
                                        {item.first} {item.last}
                                    </h4>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        onlineUsers: state.onlineUsers
    };
};

export default connect(mapStateToProps)(OnlineUsers);
