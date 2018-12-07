import uuidv4 from 'uuid/v4';
import autoBind from 'auto-bind';

import SocketServer from './SocketServer';
import Client from '../Client';
import UpdateEndpoint from './../endpoints/Update';
import { METHODS } from '../Constants';

export default class Socket extends Client {
    public readonly id:string;
    private ioSocket:any;

    constructor(ioSocket:any, server:SocketServer) {
        super(server);
        autoBind(this);

        this.ioSocket = ioSocket;
 
        this.id = uuidv4();
        
        Object.keys(server.endpoints).forEach((endpoint) => {
            METHODS.forEach((method) => {
                ioSocket.on(`${endpoint}/${method.toLowerCase()}`, (payload) => this.onRequest(endpoint, payload, method));
            })
        })
    }

    onSuccess(payload:string) {
        //TODO confirm success with socket.io
    }

    onError(message:string) {
        //TODO confirm error with socket.io (don't emit)
        this.ioSocket.emit('onerror', message);
    }
}