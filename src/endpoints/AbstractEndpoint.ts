
import Socket from '../socket/Socket';
import SocketServer from '../socket/SocketServer';

export default abstract class AbstractEndpoint {
    abstract handleEndpoint(payload:string, socket:Socket, server:SocketServer);
}