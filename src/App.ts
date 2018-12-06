import createExpress from 'express';
import http from 'http';

import './types'

import SocketServer from './server/SocketServer'
import autoBind from 'auto-bind';

export default class App {

    private port:number;

    public express:Express;
    public httpServer:HttpServer;
    public io:SocketServer;


    constructor(port:number=8000) {
        autoBind(this);
        this.port = port;

        this.express = createExpress();
        this.httpServer = new http.Server(this.express);
        this.io = new SocketServer(this.httpServer);
    }

    public start() {
        this.httpServer.listen(this.port);
    }
}
