
import http from 'http'

import SocketServer from '../SocketServer'

jest.mock('express');
jest.mock('http');
jest.mock('../Socket');

var ioStub = { // var so variable is hoisted
    on: jest.fn(),
    emit: jest.fn()
}
jest.mock('socket.io', () => (
    (httpServer) => ioStub
));

describe('SocketServer', () => {

    let socketServer:any = null;
    let mockHttpServer:HttpServer;

    beforeEach(() => {
        mockHttpServer = new http.Server();
        socketServer = new SocketServer(mockHttpServer, {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    })

    it('can be created', () => {
        expect(socketServer).toBeTruthy();
        expect(socketServer.io).toBeTruthy();
        expect(ioStub.on).toBeCalledWith('connection', socketServer.onConnectionRecieved);
    });

    it('can accept a socket', () => {
        const oldLog = console.log;
        console.log = jest.fn();

        const ioSocketStub = {};

        const socket = socketServer.onConnectionRecieved(ioSocketStub);

        // Verify we got a mock socket
        expect(socket).toHaveProperty('id', 'test');

        expect(console.log).toHaveBeenCalled();
        console.log = oldLog;
    });

    it('can validate a payload', () => {
        const validPayload = "{}";
        expect(socketServer.validatePayload(validPayload)).toBe(true);

        const invalidPayload = "invalid json";
        expect(socketServer.validatePayload(invalidPayload)).toBe(false);
    });

    it('can handle an endpoint', () => {
        const payload = "{}";
        const testEndpoint = {
            handleEndpoint: jest.fn(),
        }
        const socket = {};
        socketServer = new SocketServer(mockHttpServer, {
            test: testEndpoint,
        });
        socketServer.validatePayload = jest.fn().mockReturnValue(true);
        
        socketServer.handleEndpoint('test', payload, socket);

        expect(testEndpoint.handleEndpoint).toHaveBeenCalledWith(payload, socket, socketServer);
        expect(socketServer.validatePayload).toHaveBeenCalledWith(payload);
    });

    

});