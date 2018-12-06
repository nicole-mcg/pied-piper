import * as http from 'http';
import * as IO from 'socket.io';

export default class SocketServer {
    public io:any;

    constructor(httpServer:http.Server) {
        this.io = IO(httpServer);
    }

}