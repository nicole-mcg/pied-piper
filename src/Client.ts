
import SocketServer from './socket/SocketServer';
import Socket from './socket/Socket';

export default abstract class Client {
    protected server:SocketServer;

    constructor(server) {
        this.server = server;
    }

    abstract onSuccess(endpoint:string, payload:string);
    abstract onError(endpoint:string, message:string);

    onRequest(endpoint:string, payload:string, method:string) {
        this.server.handleEndpoint(endpoint, payload, this as unknown as Socket, method);
    }
}