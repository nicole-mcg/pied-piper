import uuidv4 from 'uuid/v4';
import autoBind from 'auto-bind';

import SocketServer from './SocketServer';
import Client from '../Client';
import UpdateEndpoint from './../endpoints/Update';

export default class Socket extends Client {
    public readonly id:string;
    private ioSocket:any;

    constructor(ioSocket:any, server:SocketServer) {
        super(server);
        autoBind(this);

        this.ioSocket = ioSocket;
 
        this.id = uuidv4();
        
        Object.keys(server.endpoints).forEach((endpoint) => {
            ioSocket.on(endpoint, (payload) => this.onRequest(endpoint, payload));
        })
    }

    onSuccess(endpoint:string, payload:string) {
        //TODO confirm success with socket.io
    }

    onError(endpoint:string, message:string) {
        const payload = {
            endpoint,
            message
        }
        //TODO confirm error with socket.io (don't emit)
        this.ioSocket.emit('onerror', JSON.stringify(payload));
    }
}