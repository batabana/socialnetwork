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
