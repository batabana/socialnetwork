import axios from "./axios";

export async function receiveFriends() {
    const { data } = await axios.get("/api/friends");
    return {
        type: "RECEIVE_FRIENDS",
        friends: data
    };
}

// export async function acceptFriend(id) {
//     const { data } = await axios.post("/api/acceptFriend/" + id);
//     return {
//         type: "ACCEPT_FRIEND",
//         friends: data
//     };
// }
