import uuidv4 from 'uuid/v4';
import autoBind from 'auto-bind';

import SocketServer from './SocketServer';
import Client from '../Client';

export default class Socket extends Client {
    public readonly id:string;
    private ioSocket:any;

    constructor(ioSocket:any, server:SocketServer) {
        super(server);
        autoBind(this);

        this.ioSocket = ioSocket;
 
        this.id = uuidv4();
        
        Object.keys(server.endpoints).forEach((endpoint) => {
            ioSocket.on(endpoint, (payload) => this.handleRequest(endpoint, payload));
        })
    }

    onError(endpoint:string, message:string) {
        const payload = {
            endpoint,
            message
        }
        this.ioSocket.emit('onerror', JSON.stringify(payload));
    }
}