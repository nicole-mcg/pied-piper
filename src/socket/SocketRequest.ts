import autoBind from 'auto-bind';
import uuidv4 from 'uuid/v4';

import App from '@app/App';
import Request from '@app/Request';

export default class SocketRequest extends Request {
    public readonly id: string;
    private ioSocket: any;

    constructor(app: App, ioSocket: any) {
        super(app);
        autoBind(this);

        this.ioSocket = ioSocket;

        this.id = uuidv4();

        Object.keys(app.endpoints).forEach((endpoint) => {
            ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach((method) => {
                ioSocket.on(`${endpoint}/${method.toLowerCase()}`, (payload) => this.onRequest(endpoint, payload, method));
            });
        });
    }

    public onSuccess(payload: string) {
        // TODO confirm success with socket.io
    }

    public onError(message: string) {
        // TODO confirm error with socket.io (don't emit)
        this.ioSocket.emit('onerror', message);
    }
}
