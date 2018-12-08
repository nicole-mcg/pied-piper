import autoBind from 'auto-bind';
import uuidv4 from 'uuid/v4';

import App from '@app/App';
import { REQUEST_METHODS } from '@app/Constants';
import Request from '@app/Request';
import SocketServer from '@socket/SocketServer';

export default class SocketRequest extends Request {
    public readonly id: string;
    private server: SocketServer;
    private ioSocket: any;
    private acknowledge: any;

    constructor(app: App, server: SocketServer, ioSocket: any) {
        super(app);
        autoBind(this);
        this.server = server;
        this.ioSocket = ioSocket;

        this.id = uuidv4();

        Object.keys(app.endpoints).forEach((endpoint) => {
            REQUEST_METHODS.forEach((method) => {
                ioSocket.on(`${endpoint}/${method.toLowerCase()}`, (payload, acknowledge) => {
                    this.acknowledge = acknowledge;
                    this.onRequest(endpoint, payload, method);
                });
            });
        });
    }

    public onSuccess(payload: string) {
        this.acknowledge(payload, false);
    }

    public onError(message: string) {
        this.acknowledge(null, message);
    }

    private onDisconnect() {
        this.server.onDisconnect(this.id);
    }
}
