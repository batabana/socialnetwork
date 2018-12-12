export default function reducer(state = {}, action) {
    // add complete list of friends/wannabes to state
    if (action.type == "RECEIVE_FRIENDS") {
        state = { ...state, friendslist: action.friendslist };
    }

    // turn new friend from wannabe to friend (copy state object, only change the new_friend element)
    if (action.type == "ACCEPT_FRIEND") {
        state = {
            ...state,
            friendslist: state.friendslist.map(user => {
                if (user.id == action.new_friend) {
                    user["accepted"] = true;
                    return user;
                } else {
                    return user;
                }
            })
        };
    }

    // delete old friend from friendslist in state
    if (action.type == "DELETE_FRIEND") {
        state = { ...state, friendslist: state.friendslist.filter(user => user.id != action.old_friend) };
    }

    if (action.type == "SEARCH_USERS") {
        state = { ...state, suggestions: action.suggestions };
    }

    if (action.type == "LIST_ONLINE_USERS") {
        state = { ...state, onlineUsers: action.online_users };
    }

    if (action.type == "ADD_ONLINE_USER") {
        state = { ...state, onlineUsers: state.onlineUsers.concat(action.new_user) };
    }

    if (action.type == "DELETE_ONLINE_USER") {
        state = { ...state, onlineUsers: state.onlineUsers.filter(user => user.id != action.old_user) };
    }

    if (action.type == "ADD_MESSAGES") {
        state = { ...state, messages: action.messages };
    }

    if (action.type == "ADD_MESSAGE") {
        state = { ...state, messages: state.messages.concat(action.new_message) };
    }

    if (action.type == "TOGGLE_INDICATOR") {
        state = { ...state, friendIndicator: action.indicator };
    }

    return state;
}
