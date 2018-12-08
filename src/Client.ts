
import Socket from './socket/Socket';
import SocketServer from './socket/SocketServer';

export default abstract class Client {
    protected server: SocketServer;

    constructor(server) {
        this.server = server;
    }

    public abstract onSuccess(payload: string);
    public abstract onError(message: string);

    public onRequest(endpoint: string, payload: string, method: string) {
        this.server.handleEndpoint(endpoint, payload, this as unknown as Socket, method);
    }
}
