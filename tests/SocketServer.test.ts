
import http from 'http';
import mockIo from 'socket.io';

import MockSocketRequest from '@socket/SocketRequest';
import SocketServer from '@socket/SocketServer';

jest.mock('express');
jest.mock('http');
jest.mock('socket.io');

jest.mock("@socket/SocketRequest", () => jest.fn().mockImplementation(() => {
    return {};
}));

describe('SocketServer', () => {
    const mockEndpoint: any = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].reduce((handlers, method) => {
        handlers[method.toLowerCase()] = jest.fn();
        return handlers;
    }, {});
    const mockEndpoints: any = { test: mockEndpoint };
    const mockApp: any = { endpoints: mockEndpoints };

    let socketServer: any = null;

    beforeEach(() => {
        const mockHttpServer = new http.Server();
        socketServer = new SocketServer(mockApp, mockHttpServer, mockEndpoints);
    });

    it('can be created', () => {
        expect(socketServer).toBeInstanceOf(SocketServer);
        expect(socketServer).toHaveProperty('endpoints', mockEndpoints);
        expect(socketServer).toHaveProperty('io');
        expect(mockIo().on).toBeCalledWith('connection', socketServer.onConnectionRecieved);
    });

    it('can accept a socket', () => {
        const recievedSocket = socketServer.onConnectionRecieved(mockIo());

        expect(MockSocketRequest).toHaveBeenCalledWith(mockApp, mockIo());
        expect(recievedSocket).toBeTruthy();
        expect(console.log).toHaveBeenCalled();
    });

});
