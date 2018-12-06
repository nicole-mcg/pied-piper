import * as http from 'http'

import MockSocket from '../Socket'
import SocketServer from '../SocketServer'

jest.mock('http');
jest.mock('../Socket');

const ioStub = {
    on: jest.fn()
}
jest.mock('socket.io', () => (
    (httpServer) => ioStub
));

describe('SocketServer', () => {

    let socketServer:any = null;

    beforeEach(() => {
        const mockHttpServer:HttpServer = new http.Server();
        socketServer = new SocketServer(mockHttpServer);
    })

    it('can be created', () => {
        expect(socketServer).toBeTruthy();
        expect(socketServer.io).toBeTruthy();
        expect(ioStub.on).toBeCalledWith('connection', socketServer.onConnectionRecieved);
    });

    it('can accept a socket', () => {
        const ioSocketStub = {};
        const expectedSocket:MockSocket = new MockSocket(ioSocketStub, socketServer.app);

        const socket = socketServer.onConnectionRecieved(ioSocketStub);
        expect(socket).toEqual(expectedSocket);
        expect(socketServer.connections).toEqual({
            [socket.id]: socket
        });
    });

});