
import http from 'http'
import mockIo from 'socket.io';

import Socket from './../Socket';
import SocketServer from '../SocketServer'

jest.mock('express');
jest.mock('http');
jest.mock('socket.io');

jest.mock('../Socket');

describe('SocketServer', () => {
    const socket:any = {};
    const endpoint:any = {};
    const endpoints:any = { test: endpoint };
    const payload:string = "{}";

    let socketServer:any = null;
    let mockHttpServer:any;

    beforeEach(() => {
        mockHttpServer = new http.Server();
        socketServer = new SocketServer(mockHttpServer, endpoints);

        endpoint.handleEndpoint = jest.fn();
        socket.emitError = jest.fn();
    });

    it('can be created', () => {
        expect(socketServer).toBeTruthy();
        expect(socketServer.endpoints).toEqual(endpoints);
        expect(socketServer.io).toBeTruthy();
        expect(mockIo().on).toBeCalledWith('connection', socketServer.onConnectionRecieved);
    });

    it('can accept a socket', () => {
        const recievedSocket = socketServer.onConnectionRecieved(mockIo());

        expect(Socket).toHaveBeenCalledWith(mockIo(), socketServer);
        expect(recievedSocket).toBeTruthy();
        expect(console.log).toHaveBeenCalled();
    });

    it('can accept a valid payload', () => {
        expect(socketServer.validatePayload("{}")).toBe(true);
    });

    it('can deny an invalid payload', () => {
        expect(socketServer.validatePayload("invalid json")).toBe(false);
    });

    it('can handle an endpoint', () => {
        socketServer.validatePayload = jest.fn().mockReturnValue(true);
        
        socketServer.handleEndpoint('test', payload, socket);

        expect(endpoint.handleEndpoint)
            .toHaveBeenCalledWith(payload, socket, socketServer);
        expect(socketServer.validatePayload)
            .toHaveBeenCalledWith(payload);
    });

    it('wont handle an endpoint if invalid payload', () => {
        socketServer.validatePayload = jest.fn().mockReturnValue(false);
        
        socketServer.handleEndpoint('test', payload, socket);

        expect(endpoint.handleEndpoint).not.toHaveBeenCalled();
        expect(socketServer.validatePayload).toHaveBeenCalledWith(payload);
        expect(socket.emitError).toHaveBeenCalled();
    });

});