import * as io from "socket.io-client";
import { listOnlineUsers, addOnlineUser, deleteOnlineUser } from "./actions";

let socket;
export default function initSocket(store) {
    if (!socket) {
        socket = io.connect();
    }

    socket.on("onlineUsers", listOfOnlineUsers => {
        // save to redux
        store.dispatch(listOnlineUsers(listOfOnlineUsers));
    });
    socket.on("userJoined", newUser => {
        store.dispatch(addOnlineUser(newUser[0]));
    });
    socket.on("userLeft", oldUser => {
        store.dispatch(deleteOnlineUser(oldUser));
    });
    return socket;
}
