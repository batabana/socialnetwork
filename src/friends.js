import React from "react";
import { connect } from "react-redux";
import { receiveFriends, deleteFriend, acceptFriend } from "./actions";

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
        if (!friends) {
            return null;
        }
        if (!wannabes) {
            return null;
        }
        return (
            <div className="friends-container">
                <h1>Wannabes</h1>
                <div className="friendslist">
                    {wannabes.map(wannabe => {
                        return (
                            <div key={wannabe.id}>
                                <img src={wannabe.image} />
                                <div className="friend">
                                    {wannabe.first} {wannabe.last}
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
                                <img src={friend.image} />
                                <div className="friend">
                                    {friend.first} {friend.last}
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
