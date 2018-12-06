import * as http from 'http';
import * as IO from 'socket.io';

import Socket from './Socket'

export default class SocketServer {
    public io:any;
    public readonly connections:{ 
        [id:string]: Socket 
    };

    constructor(httpServer:http.Server) {
        this.io = IO(httpServer);
        this.connections = {};

        this.io.on('connection', this.onConnectionRecieved);
    }

    onConnectionRecieved(ioSocket:any) : Socket {
        const socket:Socket = new Socket(ioSocket, this);
        this.connections[socket.id] = socket;
        return socket;
    }

    

}