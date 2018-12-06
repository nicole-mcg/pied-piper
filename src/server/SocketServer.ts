import http from 'http';
import IO from 'socket.io';

import autoBind from 'auto-bind';

import { makeDirAndWriteToFile } from '../helpers/FileHelper'
import Socket from './Socket'

export default class SocketServer {
    public io:any;

    constructor(httpServer:http.Server) {
        autoBind(this);
        this.io = IO(httpServer);

        this.io.on('connection', this.onConnectionRecieved);
    }

    onConnectionRecieved(ioSocket:any) : Socket {
        const socket:Socket = new Socket(ioSocket, this);
        console.log("Connection recieved: " + socket.id);
        return socket;
    }

    onUpdate(payload:string, socket:Socket):Promise<any> {//TODO move to routed endpoint and cll that
        if (!this.validatePayload(payload)) {
            socket.emitError("update", "Invalid request data");
            return Promise.reject();
        }

        const dirPath = __dirname + "/../../data";
        const filePath = __dirname + "/../../data/file.json";

        return makeDirAndWriteToFile(dirPath, filePath, payload)
            .then(() => this.emitUpdate(payload))
            .catch(() => this.onSaveError(socket));
    }

    emitUpdate(payload) {
        this.io.emit('update', payload);
    }

    onDisconnect(socket:Socket) {

    }

    private onSaveError(socket) {
        socket.emitError('update', "Error saving data");
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