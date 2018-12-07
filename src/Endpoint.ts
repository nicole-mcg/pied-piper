import './types'

export default abstract class Endpoint {
    abstract handleEndpoint(payload:string, socket:Socket, server:SocketServer);
}