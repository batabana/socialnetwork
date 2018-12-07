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

    return state;
}
