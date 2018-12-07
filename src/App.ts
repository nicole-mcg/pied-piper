import express from 'express';
import http from 'http';
import autoBind from 'auto-bind';

import SocketServer from './socket/SocketServer';
import UpdateEndpoint from './endpoints/Update';

export default class App {

    private port:number;

    private express:express.Express;
    private httpServer:http.Server;
    private io:SocketServer;

    constructor(port:number=8000) {
        autoBind(this);
        this.port = port;

        this.express = express();
        this.httpServer = new http.Server(this.express);
        this.io = new SocketServer(this.httpServer, {
            update: new UpdateEndpoint(),
        });
    }

    public start() {
        this.httpServer.listen(this.port);
    }
}
