import http from 'http'

import MockExpress from 'express';

import MockSocketServer from '../../socket/SocketServer';
import HttpServer from './../HttpServer';

jest.mock('http');
jest.mock('express', () => {
    return jest.fn().mockImplementation(() => {
        return {
            get: jest.fn()
        }
    })
});

jest.mock("../../socket/SocketServer");

describe('HttpServer', () => {
    const mockEndpoint:any = { handleEndpoint: jest.fn() };
    const mockEndpoints = { 'test': mockEndpoint }
    const mockExpress = MockExpress();
    const testPort = 99;

    let httpServer:any;

    beforeEach(() => {
        httpServer = new HttpServer(testPort, mockExpress, mockEndpoints);
    })

    it('can be created', () => {
        expect(httpServer).toBeInstanceOf(HttpServer)
        expect(httpServer).toHaveProperty('port', testPort);
        expect(httpServer).toHaveProperty('endpoints', mockEndpoints);
        expect(httpServer).toHaveProperty('baseServer', expect.any(http.Server));
        expect(httpServer).toHaveProperty('socketServer', expect.any(MockSocketServer))

        const SocketServerClass:any = MockSocketServer;
        expect(SocketServerClass).toHaveBeenCalledWith(httpServer.baseServer, mockEndpoints);
        
        Object.keys(mockEndpoints).forEach((endpoint) => {
            expect(mockExpress.get).toHaveBeenCalledWith(`/${endpoint}`, expect.any(Function))
        })
    });

    it('can be started', () => {
        httpServer.baseServer.listen = jest.fn();
        httpServer.start();
        expect(httpServer.baseServer.listen).toHaveBeenCalledWith(testPort);
    });

});