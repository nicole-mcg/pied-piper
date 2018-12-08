import http from 'http';
import IO from 'socket.io';

import autoBind from 'auto-bind';

import App from '@app/App';
import Endpoint from '@endpoints/Endpoint';
import SocketRequest from '@socket/SocketRequest';

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

    public onConnectionRecieved(ioSocket: any): SocketRequest {
        const socket: SocketRequest = new SocketRequest(this.app, ioSocket);
        console.log("Connection recieved: " + socket.id);
        return socket;
    }

}
