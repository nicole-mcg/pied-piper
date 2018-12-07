import createExpress from 'express';
import http from 'http';
import autoBind from 'auto-bind';

import './types';

import SocketServer from './server/SocketServer';
import UpdateEndpoint from './endpoints/Update';

export default class App {

    private port:number;
    
    private express:Express;
    private httpServer:HttpServer;
    private io:SocketServer;

    constructor(port:number=8000) {
        autoBind(this);
        this.port = port;

        this.express = createExpress();
        this.httpServer = new http.Server(this.express);
        this.io = new SocketServer(this.httpServer, {
            update: new UpdateEndpoint(),
        });
    }

    public start() {
        this.httpServer.listen(this.port);
    }
}
