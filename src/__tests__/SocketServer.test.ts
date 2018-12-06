import * as http from 'http'

import SocketServer from '../SocketServer'

jest.mock('http');
jest.mock('socket.io', () => (
    (httpServer) => ({})
));

describe('SocketServer', () => {

    it('can be created', () => {
        const mockHttpServer:HttpServer = new http.Server();
        const socketServer = new SocketServer(mockHttpServer);

        expect(socketServer).toBeTruthy();
        expect(socketServer.io).toBeTruthy();
    });

    xit('can ...', () => {
    });

});