import http from 'http'

import express from 'express';

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
    const mockExpress = express();
    const testPort = 99;

    it('can be created', () => {
        const httpServer:any = new HttpServer(testPort, mockExpress, mockEndpoints);

        expect(httpServer).toBeInstanceOf(HttpServer)
        expect(httpServer).toHaveProperty('port', testPort);
        expect(httpServer).toHaveProperty('endpoints', mockEndpoints);
        expect(httpServer).toHaveProperty('baseServer', expect.any(http.Server));
        expect(httpServer).toHaveProperty('socketServer', expect.any(MockSocketServer))

        const SocketServerClass:any = MockSocketServer;
        expect(SocketServerClass).toHaveBeenCalledWith(httpServer.baseServer, mockEndpoints);
    });

    it('will call registerEndpoints from constructor', () => {
        // Mock registerEndpoints on HttpServer prototype
        const httpServerPrototype:any = HttpServer.prototype;
        const oldRegisterEndpoints = httpServerPrototype.registerEndpoints;
        httpServerPrototype.registerEndpoints = jest.fn();

        const httpServer:any = new HttpServer(testPort, mockExpress, mockEndpoints)
        expect(httpServer.registerEndpoints).toHaveBeenCalledWith(mockExpress);

        // Restore HttpServer prototype
        httpServerPrototype.registerEndpoints = oldRegisterEndpoints;
    })

    it('can register endpoints', () => {
        const httpServer:any = new HttpServer(testPort, mockExpress, mockEndpoints);

        httpServer.registerEndpoints(mockExpress);

        Object.keys(mockEndpoints).forEach((endpoint) => {
            expect(mockExpress.get).toHaveBeenCalledWith(`/${endpoint}`, expect.any(Function))
        })
    });

    it('can be started', () => {
        const httpServer:any = new HttpServer(testPort, mockExpress, mockEndpoints);

        httpServer.baseServer.listen = jest.fn();
        httpServer.start();
        expect(httpServer.baseServer.listen).toHaveBeenCalledWith(testPort);
    });

});