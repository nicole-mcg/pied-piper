import http from 'http';
import IO from 'socket.io';

import autoBind from 'auto-bind';

import Client from '../Client';
import Endpoint from '../endpoints/Endpoint';
import App from './../App';
import Socket from './Socket';

export default class SocketServer {
    public io: any;
    public endpoints: { [s: string]: Endpoint };
    private app: App;

    constructor(app: App, httpServer: http.Server, endpoints: { [s: string]: Endpoint }= {}) {
        this.app = app;
        autoBind(this);
        this.endpoints = endpoints;
        this.io = IO(httpServer);

        this.io.on('connection', this.onConnectionRecieved);
    }

    public onConnectionRecieved(ioSocket: any): Socket {
        const socket: Socket = new Socket(this.app, ioSocket);
        console.log("Connection recieved: " + socket.id);
        return socket;
    }

}
