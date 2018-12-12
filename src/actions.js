import axios from "./axios";

export async function receiveFriends() {
    const { data } = await axios.get("/api/friends");
    return {
        type: "RECEIVE_FRIENDS",
        friendslist: data
    };
}

export async function acceptFriend(id) {
    await axios.post("/api/acceptFriend/" + id);
    return {
        type: "ACCEPT_FRIEND",
        new_friend: id
    };
}

export async function deleteFriend(id) {
    await axios.post("/api/deleteFriend/" + id);
    return {
        type: "DELETE_FRIEND",
        old_friend: id
    };
}

export async function searchUsers(input) {
    if (input) {
        const { data } = await axios.get("/api/search/" + input);
        return {
            type: "SEARCH_USERS",
            suggestions: data
        };
    } else {
        return {
            type: "SEARCH_USERS",
            suggestions: []
        };
    }
}

export async function listOnlineUsers(listOfOnlineUsers) {
    return {
        type: "LIST_ONLINE_USERS",
        online_users: listOfOnlineUsers
    };
}

export async function addOnlineUser(newUser) {
    return {
        type: "ADD_ONLINE_USER",
        new_user: [newUser]
    };
}

export async function deleteOnlineUser(oldUser) {
    return {
        type: "DELETE_ONLINE_USER",
        old_user: oldUser
    };
}

export function addMessages(messages) {
    return {
        type: "ADD_MESSAGES",
        messages
    };
}

export function addMessage(message) {
    return {
        type: "ADD_MESSAGE",
        new_message: message
    };
}

export function toggleIndicator(status) {
    return {
        type: "TOGGLE_INDICATOR",
        indicator: status
    };
}
