import uuidv4 from 'uuid/v4';

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
        
        Object.keys(server.endpoints).forEach((endpoint) => {
            ioSocket.on(endpoint, (payload) => this.handleRequest(endpoint, payload));
        })
    }

    handleRequest(endpoint:string, payload:string) {
        this.server.handleEndpoint(endpoint, payload, this);
    }

    emitError(endpoint:string, message:string) {
        const payload = {
            endpoint,
            message
        }
        this.ioSocket.emit('onerror', JSON.stringify(payload));
    }

}