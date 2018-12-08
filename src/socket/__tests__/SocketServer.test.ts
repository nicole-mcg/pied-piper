
import http from 'http';
import mockIo from 'socket.io';

import { METHODS } from '../../Constants';
import MockSocketRequest from '../SocketRequest';
import SocketServer from '../SocketServer';

jest.mock('express');
jest.mock('http');
jest.mock('socket.io');

jest.mock('../SocketRequest');

describe('SocketServer', () => {
    const mockApp: any = {};
    const mockEndpoint: any = METHODS.reduce((handlers, method) => {
        handlers[method.toLowerCase()] = jest.fn();
        return handlers;
    }, {});
    const mockEndpoints: any = { test: mockEndpoint };
    const mockPayload: string = "{}";

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
