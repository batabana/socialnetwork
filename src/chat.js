import React from "react";
import { connect } from "react-redux";
import initSocket from "./socket";
import { Link } from "react-router-dom";

class Chat extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.sendMessage = this.sendMessage.bind(this);
    }

    sendMessage(e) {
        let socket = initSocket();
        if (e.which === 13) {
            socket.emit("newMessage", e.target.value);
            e.target.value = "";
        }
    }

    // runs on every update on the component, e.g. a new message
    // responsible for placing the messages in the right place
    // componentDidUpdate() {
    //     if (!this.elem) {
    //         return null;
    //     }
    //     this.elem.scrollTop = this.elem.scrollHeight;
    // }

    render() {
        if (!this.props.messages) {
            return null;
        }
        let arrOfMessages = this.props.messages.map((elem, idx) => {
            return (
                <div key={idx} className="message">
                    <Link to={"/user/" + elem.sender}>
                        <img src={elem.image} alt={elem.first + " " + elem.last} title={elem.first + " " + elem.last} />
                    </Link>
                    {elem.message} <span className="timestamp">{elem.createtime_rel}</span>
                </div>
            );
        });
        return (
            <div className="chat-container">
                <h1>Chat</h1>
                <div className="message-container" ref={elem => (this.elem = elem)}>
                    {arrOfMessages}
                </div>
                <textarea onKeyDown={this.sendMessage} />
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        messages: state.messages
    };
};

export default connect(mapStateToProps)(Chat);
