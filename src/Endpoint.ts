
import Socket from './server/Socket';
import SocketServer from './server/SocketServer';

export default abstract class Endpoint {
    abstract handleEndpoint(payload:string, socket:Socket, server:SocketServer);
}