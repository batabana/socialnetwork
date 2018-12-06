export default function reducer(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS") {
        state = { ...state, friends: action.friends };
    }
    return state;
}
