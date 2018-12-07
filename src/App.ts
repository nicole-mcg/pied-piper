import express from 'express';
import autoBind from 'auto-bind';

import Endpoint from './endpoints/AbstractEndpoint';
import HttpClient from './http/HttpClient';

import SocketServer from './socket/SocketServer';
import UpdateEndpoint from './endpoints/Update';
import HttpServer from './http/HttpServer';

export const ENDPOINTS = {
    update: new UpdateEndpoint(),
}

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
