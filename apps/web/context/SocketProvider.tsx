"use client";
import React, { useState, useCallback, useEffect, useContext } from "react";
import { io, Socket } from "socket.io-client";

const PORT = 5000;
const DOMAIN = `http://localhost`;

interface SocketProviderProps {
    children?: React.ReactNode;
}

interface Messages {
    message: string;
    sender: string;
    timestamp: string;
}

interface ISocketContext {
    sendMessage: (msg: string) => any;
    messages: Messages[] | undefined;
}


const SocketContext = React.createContext<ISocketContext | null>(null);

// custom hook to handle socket
export const useSocket = () => {
    const state = useContext(SocketContext);
    if (!state) throw new Error(`State is undefined`);

    return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<Messages[]>([]);

    const sendMessage: ISocketContext["sendMessage"] = useCallback(
        (msg: string) => {
            console.log(`Send Message: ${msg}. From: ${socket?.id}.`);
            if (socket) {
                socket.emit("event:messageSent", {
                    message: msg,
                    socket: socket.id,
                });
            }
        },
        [socket],
    );

    const onMessageRec = useCallback((msg: string) => {
        console.log(`From Server, Message received: ${msg}`);
        const message = JSON.parse(msg) as { message: string; sender: string, timestamp: string };
        console.log(message);
        setMessages((prevMessages) => [...prevMessages, message]);
    }, []);

    useEffect(() => {
        const _socket = io(`${DOMAIN}:${PORT}`);
        _socket.on("event:message", onMessageRec);
        setSocket(_socket);

        return () => {
            setSocket(undefined);
            _socket.disconnect();
            _socket.off("event:message", onMessageRec);
        };
    }, []);

    return (
        <SocketContext.Provider value={{ sendMessage, messages }}>
            {children}
        </SocketContext.Provider>
    );
};

/**
Context API:

The code defines a context using React.createContext. This context will hold a function named sendMessage for sending messages through the Socket.IO channel.
Interfaces (ISocketContext and implicit interface for SocketProviderProps) are used for type safety (often with TypeScript) to define the expected structure of data and props.

SocketProvider Component:

This functional component (SocketProvider) acts as a provider for the context. It wraps your application's components (children) and makes the sendMessage function available to them.
The sendMessage function is created using useCallback to ensure it's memoized (remembered) and not recreated on every render, improving performance.
Inside the provider's return statement, the SocketContext.Provider component is used to make the context value ({{ sendMessage }}) accessible to its descendants.

 */