import autoBind from 'auto-bind';
import express from 'express';

import Client from '../Client';
import SocketServer from '../socket/SocketServer';

export default class HttpClient extends Client {
    private req: express.Request;
    private res: express.Response;

    constructor(req: express.Request, res: express.Response, server: SocketServer) {
        super(server);
        autoBind(this);

        this.req = req;
        this.res = res;
    }

    public onSuccess(payload: string) {
        this.res.send(payload);
    }

    public onError(message: string) {
        const payload = { error: message };
        this.res.send(JSON.stringify(payload));
    }
}
