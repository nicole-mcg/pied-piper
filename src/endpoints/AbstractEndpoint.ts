import Client from '../Client';
import SocketServer from '../socket/SocketServer';

export default abstract class AbstractEndpoint {
    abstract handleEndpoint(payload:string, client:Client, server:SocketServer);
}