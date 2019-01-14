
import http from 'http';
import io from 'socket.io';

import { REQUEST_METHODS } from '@app/Constants';
import MockSocketConnection from '@app/socket/SocketConnection';
import SocketServer from '@socket/SocketServer';

jest.mock('express');
jest.mock('http');

const mockIo: any = jest.fn();
mockIo.on = jest.fn();
mockIo.emit = jest.fn();
jest.mock('socket.io', () => jest.fn().mockImplementation(() => mockIo));

jest.mock("@socket/SocketConnection", () => jest.fn().mockImplementation(() => {
    return {};
}));

describe('SocketServer', () => {
    const mockIo = io();
    const mockEndpoint: any = REQUEST_METHODS.reduce((handlers, method) => {
        handlers[method.toLowerCase()] = jest.fn();
        return handlers;
    }, {});
    const mockEndpoints: any = { test: mockEndpoint };
    const mockHttpServer = new http.Server();
    const mockApp: any = { endpoints: mockEndpoints };

    let socketServer: any = null;

    beforeEach(() => {
        socketServer = new SocketServer(mockApp, mockHttpServer, mockEndpoints);
    });

    it('can be created', () => {
        expect(socketServer).toBeInstanceOf(SocketServer);
        expect(socketServer).toHaveProperty('endpoints', mockEndpoints);
        expect(socketServer).toHaveProperty('io');
        expect(mockIo.on).toBeCalledWith('connection', socketServer.onConnectionRecieved);
    });

    it('can accept a socket', () => {
        const recievedSocket = socketServer.onConnectionRecieved(mockIo);

        expect(MockSocketConnection).toHaveBeenCalledWith(mockApp, socketServer, mockIo);
        expect(recievedSocket).toBeTruthy();
        expect(console.log).toHaveBeenCalled();
    });

    it('will print a message on disconnect', () => {
        socketServer.onDisconnect(null);
        expect(console.log).toHaveBeenCalled();
    });

});
