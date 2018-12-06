const uuidv4 = require('uuid/v4');

import autoBind from 'auto-bind';
import SocketServer from './SocketServer';

export default class Socket {
    private server:SocketServer;
    public readonly id:string;
    private ioSocket:any;

    constructor(ioSocket:any, server:SocketServer) {
        autoBind(this);

        this.ioSocket = ioSocket;
        this.server = server;

        this.id = uuidv4();
        
        ioSocket.on('disconnect', this.onDisconnect);
        ioSocket.on('update', this.onUpdate);
    }

    onUpdate(payload:string) {
        this.server.onUpdate(payload, this);
    }

    onDisconnect() {
        this.server.onDisconnect(this);
    }

    emitError(endpoint:string, message:string) {
        const payload = {
            endpoint,
            message
        }
        this.ioSocket.emit('onerror', JSON.stringify(payload));
    }

}