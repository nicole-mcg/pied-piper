import express from 'express';
import autoBind from 'auto-bind';

import SocketServer from './socket/SocketServer';
import HttpServer from './http/HttpServer';
import { ENDPOINTS } from './Constants';

export default class App {
    private express:express.Express;
    private httpServer:HttpServer;
    private io:SocketServer;

    constructor(port:number=8000) {
        autoBind(this);

        this.express = express();
        this.httpServer = new HttpServer(port, this.express, ENDPOINTS);
        this.io = this.httpServer.socketServer;

        this.httpServer.start();
    }
}
