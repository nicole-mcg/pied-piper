import express from 'express';
import http from 'http';

import { METHODS } from '../Constants';
import Endpoint from '../endpoints/Endpoint';
import App from './../App';
import SocketServer from './../socket/SocketServer';
import HttpClient from './HttpClient';

export default class HttpServer {
    public readonly socketServer: SocketServer;
    private app: App;
    private port: number;
    private baseServer: http.Server;
    private endpoints: { [s: string]: Endpoint };

    constructor(app: App, port: number, express: express.Express, endpoints: { [s: string]: Endpoint }= {}) {
        this.app = app;
        this.port = port;
        this.endpoints = endpoints;
        this.baseServer = new http.Server(express);
        this.socketServer = new SocketServer(app, this.baseServer, this.endpoints);

        this.registerEndpoints(express);
    }

    public start() {
        this.baseServer.listen(this.port);
    }

    private registerEndpoints(express: express.Express) {
        Object.keys(this.endpoints).forEach((endpoint) => {
            METHODS.forEach((method) => {
                const functionName = method.toLowerCase();
                express[functionName](`/${endpoint}`, this.createRouteHandler(endpoint, method));
            });
        });
    }

    private createRouteHandler(endpoint, method) {
        return (req: express.Request, res: express.Response) => {
            const httpClient: HttpClient = new HttpClient(this.app, req, res);
            const payload = Object.keys(req.query).length === 0 ? "" : JSON.stringify(req.query);
            this.app.onRequest(endpoint, payload, httpClient, method);
        };
    }
}
