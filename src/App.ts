import autoBind from 'auto-bind';
import express from 'express';

import { ENDPOINTS } from '@app/Constants';
import Request from '@app/Request';
import Endpoint from '@endpoints/Endpoint';
import HttpServer from '@http/HttpServer';
import SocketServer from '@socket/SocketServer';

export default class App {
    public readonly endpoints: { [s: string]: Endpoint };
    private express: express.Express;
    private httpServer: HttpServer;
    private io: SocketServer;

    constructor(port: number= 8000, endpoints= ENDPOINTS) {
        autoBind(this);
        this.express = express();
        this.httpServer = new HttpServer(this, port, this.express, endpoints);
        this.io = this.httpServer.socketServer;
        this.endpoints = endpoints;

        this.httpServer.start();
    }

    public onRequest(endpointName: string, payload: string, request: Request, method: string) {
        if (!this.validatePayload(payload)) {
            request.onError("Invalid request data");
            return;
        }

        const endpoint: Endpoint = this.endpoints[endpointName];
        if (!endpoint) {
            return;
        }

        const funcName = method.toLowerCase();
        endpoint[funcName](payload, request, this.io);
    }

    private validatePayload(payload: string): boolean {
        if (!payload) {
            return true;
        }

        try {
            JSON.parse(payload);
            return true;
        } catch (e) {
            return false;
        }
    }
}
