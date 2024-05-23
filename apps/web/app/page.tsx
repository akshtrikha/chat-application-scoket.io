"use client";

import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import classes from "./page.module.css";

export default function Page() {
    const [message, setMessage] = useState("");
    const { sendMessage, messages } = useSocket();

    return (
        <div className={classes["root"]}>
            <div>
                <h1>Chat Application</h1>
            </div>
            <div>
                <input
                    className={classes["chat-input"]}
                    placeholder="Message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    onClick={(e) => {
                        let msg = message;
                        if(msg) {
                            sendMessage(msg);
                            setMessage("");
                        }
                    }}
                    className={classes["send-btn"]}
                >
                    Send
                </button>
            </div>
            <div>
                <h3>Messages</h3>
                <div>
                    {messages?.map((msg) => (
                        <li key={msg.timestamp}>
                            Message: {msg.message} | Sender: {msg.sender} at {msg.timestamp}
                        </li>
                    ))}
                </div>
            </div>
        </div>
    );
}
