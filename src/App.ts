import express from 'express';
import http from 'http';
import autoBind from 'auto-bind';

import Endpoint from './endpoints/AbstractEndpoint';
import HttpClient from './http/HttpClient';

import SocketServer from './socket/SocketServer';
import UpdateEndpoint from './endpoints/Update';

export const ENDPOINTS = {
    update: new UpdateEndpoint(),
}

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
        this.io = new SocketServer(this.httpServer, ENDPOINTS);

        Object.keys(ENDPOINTS).forEach((endpoint) => {
            this.express.get(`/${endpoint}`, (req:express.Request, res:express.Response) => {
                const httpClient:HttpClient = new HttpClient(req, res, this.io);
                this.io.handleEndpoint(endpoint, JSON.stringify(req.params), httpClient);
            })
        });
    }

    public start() {
        this.httpServer.listen(this.port);
    }
}
