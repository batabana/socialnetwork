import React from "react";
import { connect } from "react-redux";
import { receiveFriends, deleteFriend, acceptFriend } from "./actions";
import { Link } from "react-router-dom";

class Friends extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        this.props.dispatch(receiveFriends());
    }

    render() {
        const { friends, wannabes } = this.props;
        // empty arrays vs. not existing elements
        if (!friends || !wannabes) {
            return null;
        }
        return (
            <div className="friends-container">
                <h1>Wannabes</h1>
                <div className="friendslist">
                    {wannabes.map(wannabe => {
                        return (
                            <div key={wannabe.id}>
                                <Link to={"/user/" + wannabe.id}>
                                    <img src={wannabe.image || "/default.jpg"} />
                                </Link>
                                <div className="friend">
                                    <h4>
                                        {wannabe.first} {wannabe.last}
                                    </h4>
                                    <button onClick={() => this.props.dispatch(acceptFriend(wannabe.id))}>
                                        Accept Friend Request
                                    </button>
                                    <button onClick={() => this.props.dispatch(deleteFriend(wannabe.id))}>
                                        Reject Friend Request
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <h1>Friends</h1>
                <div className="friendslist">
                    {friends.map(friend => {
                        return (
                            <div key={friend.id}>
                                <Link to={"/user/" + friend.id}>
                                    <img src={friend.image || "/default.jpg"} />
                                </Link>
                                <div className="friend">
                                    <h4>
                                        {friend.first} {friend.last}
                                    </h4>
                                    <button onClick={() => this.props.dispatch(deleteFriend(friend.id))}>
                                        End Friendship
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

// runs everytime something changes in the state
const mapStateToProps = state => {
    // get the whole friends|wannabe list from database and map into two separate lists
    var list = state.friendslist;
    return {
        friends: list && list.filter(user => user.accepted == true),
        wannabes: list && list.filter(user => !user.accepted)
    };
};

export default connect(mapStateToProps)(Friends);
