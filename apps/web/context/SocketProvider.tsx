"use client";
import React, { useCallback, useEffect } from "react";
import {io} from "socket.io-client";

const PORT = 5000;
const DOMAIN = `http://localhost`

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string) => any;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg: string) => {
      console.log(`Send Message: ${msg}`);
    },
    []
  );

  useEffect(() => {
    const _socket = io(`${DOMAIN}:${PORT}`);

    return () => {
        _socket.disconnect();
    }
  }, [])

  return (
    <SocketContext.Provider value={{ sendMessage }}>
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

 */;