import * as io from "socket.io-client";
import { listOnlineUsers, addOnlineUser, deleteOnlineUser, addMessages, addMessage } from "./actions";

let socket;
export default function initSocket(store) {
    if (!socket) {
        socket = io.connect();

        socket.on("onlineUsers", listOfOnlineUsers => {
            store.dispatch(listOnlineUsers(listOfOnlineUsers));
        });

        socket.on("userJoined", newUser => {
            store.dispatch(addOnlineUser(newUser[0]));
        });

        socket.on("userLeft", oldUser => {
            store.dispatch(deleteOnlineUser(oldUser));
        });

        socket.on("latestMessages", latestMessages => {
            store.dispatch(addMessages(latestMessages));
        });

        socket.on("messageObj", message => {
            store.dispatch(addMessage(message));
        });
    }

    return socket;
}
