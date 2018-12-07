
import http from 'http'
import mockIo from 'socket.io';

import MockSocket from './../Socket';
import SocketServer from '../SocketServer'
import { METHODS } from '../../Constants'

jest.mock('express');
jest.mock('http');
jest.mock('socket.io');

jest.mock('../Socket');

describe('SocketServer', () => {
    const mockClient = { onError: jest.fn() };
    const mockEndpoint:any = METHODS.reduce((handlers, method) => {
        handlers[method.toLowerCase()] = jest.fn();
        return handlers;
    }, {})
    const mockEndpoints:any = { test: mockEndpoint };
    const mockPayload:string = "{}";

    let socketServer:any = null;
    let mockHttpServer:any;

    beforeEach(() => {
        mockHttpServer = new http.Server();
        socketServer = new SocketServer(mockHttpServer, mockEndpoints);
    });

    it('can be created', () => {
        expect(socketServer).toBeInstanceOf(SocketServer);
        expect(socketServer).toHaveProperty('endpoints', mockEndpoints);
        expect(socketServer).toHaveProperty('io');
        expect(mockIo().on).toBeCalledWith('connection', socketServer.onConnectionRecieved);
    });

    it('can accept a socket', () => {
        const recievedSocket = socketServer.onConnectionRecieved(mockIo());

        expect(MockSocket).toHaveBeenCalledWith(mockIo(), socketServer);
        expect(recievedSocket).toBeTruthy();
        expect(console.log).toHaveBeenCalled();
    });

    it('can accept a valid payload', () => {
        expect(socketServer.validatePayload("{}")).toBe(true);
    });

    it('can deny an invalid payload', () => {
        expect(socketServer.validatePayload("invalid json")).toBe(false);
    });

    METHODS.forEach(method => {
        method = method.toLowerCase();
        it(`can handle an endpoint with method: ${method}`, () => {
            socketServer.validatePayload = jest.fn().mockReturnValue(true);
            
            socketServer.handleEndpoint('test', mockPayload, mockClient, method);
    
            expect(mockEndpoint[method])
                .toHaveBeenCalledWith(mockPayload, mockClient, socketServer);
            expect(socketServer.validatePayload)
                .toHaveBeenCalledWith(mockPayload);
        });
    });

    it('wont handle an endpoint if invalid payload', () => {
        socketServer.validatePayload = jest.fn().mockReturnValue(false);
        
        socketServer.handleEndpoint('test', mockPayload, mockClient);

        METHODS.forEach((method) => {
            expect(mockEndpoint[method.toLowerCase()]).not.toHaveBeenCalled();
        })
        expect(socketServer.validatePayload).toHaveBeenCalledWith(mockPayload);
        expect(mockClient.onError).toHaveBeenCalled();
    });

});