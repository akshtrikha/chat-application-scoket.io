import { Server } from "socket.io";
import Redis from "ioredis";
// import { Date } from "date-fns";

const pub = new Redis();
const sub = new Redis();

class SocketService {
    // Creating a private member variable to hold the socket.io server
    private _io: Server;

    // Initialising the socket.io server
    constructor() {
        console.log("Initialising Socket Service...");
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            },
        });

        sub.subscribe("MESSAGES");
    }

    // initialising the public listeners for socket.io connections.
    // these listeners will allow us to receive messages by listening to events
    public initListeners() {
        const io = this._io;

        console.log(`Initialising Socket Listeners...`);
        // when a user gets connected....
        io.on("connect", async (socket) => {
            console.log(
                `New Socket Connected.\nSocket: ${socket} \nSocket_ID: ${socket.id}`,
            );

            socket.on("disconnect", (reason) => {
                console.log(
                    `Old Socket Disconnected. \nSocket: ${socket} \n Socket_ID: ${socket.id}. \n Reason: ${reason}`,
                );
            });

            // when there is a new message...
            // the argument is simply desctructured and its type is mentioned.
            socket.on(
                "event:messageSent",
                async ({ message }: { message: string }) => {
                    console.log(
                        `New Message Received. Message: ${message}. From: ${socket.id}`,
                    );
                    // publish this message to the redis using pub object
                    await pub.publish(
                        "MESSAGES",
                        JSON.stringify({ message, sender: socket.id, timestamp: Date.now() }),
                    );
                },
            );
        });

        sub.on("message", (channel, message) => {
            console.log(message, channel);
            if (channel === "MESSAGES") {
                io.emit("event:message", message);
            }
        });
    }

    // getter to get this server
    get io() {
        return this._io;
    }
}

export default SocketService;
