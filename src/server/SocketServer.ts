import * as http from 'http';
import * as IO from 'socket.io';

import Socket from './Socket'

export default class SocketServer {
    public io:any;

    constructor(httpServer:http.Server) {
        this.io = IO(httpServer);

        this.io.on('connection', this.onConnectionRecieved);
    }

    onConnectionRecieved(ioSocket:any) : Socket {
        const socket:Socket = new Socket(ioSocket, this);
        return socket;
    }

    onUpdate(payload:string, socket:Socket) {
        if (!this.validatePayload(payload)) {
            socket.emitError("update", "Invalid request data");
            return false;
        }

        this.emitUpdate(payload);
        return true;
    }

    emitUpdate(payload) {
        this.io.emit('update', payload);
    }

    onDisconnect(socket:Socket) {

    }

    private validatePayload(payload):boolean {
        try {
            JSON.parse(payload);
            return true;
        } catch(e) {
            return false;
        }
    }

}