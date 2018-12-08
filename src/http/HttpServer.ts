import express from 'express';
import http from 'http';

import App from '@app/App';

import { REQUEST_METHODS } from '@app/Constants';
import Endpoint from '@endpoints/Endpoint';
import HttpRequest from '@http/HttpRequest';
import SocketServer from '@socket/SocketServer';

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
        this.baseServer.listen(this.port, () => console.log(`Server started on port ${this.port}`));
    }

    private registerEndpoints(express: express.Express) {
        Object.keys(this.endpoints).forEach((endpoint) => {
            REQUEST_METHODS.forEach((method) => {
                const functionName = method.toLowerCase();
                express[functionName](`/${endpoint}`, this.createRouteHandler(endpoint, method));
            });
        });
    }

    private createRouteHandler(endpoint, method) {
        return (req: express.Request, res: express.Response) => {
            const httpRequest: HttpRequest = new HttpRequest(this.app, req, res);
            httpRequest.onRequest(endpoint, httpRequest.payload, method);
        };
    }
}
