import http from "http";
import SocketService from "./services/socket";

async function init() {
    const socketService = new SocketService();

    // creating a http server
    const httpServer = http.createServer();
    const PORT = process.env.PORT ? process.env.PORT : 5000;

    // attaching the socket server to this http server
    socketService.io.attach(httpServer);

    httpServer.listen(PORT, () => {
        console.log(`HTTP server started @ ${PORT}`);
    });

    socketService.initListeners();
}

init();
