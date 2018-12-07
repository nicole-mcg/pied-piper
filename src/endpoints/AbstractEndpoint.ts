
import Socket from '../server/Socket';
import SocketServer from '../server/SocketServer';

export default abstract class AbstractEndpoint {
    abstract handleEndpoint(payload:string, socket:Socket, server:SocketServer);
}