import mockExpress from 'express';

import App from '../App'
import MockHttpServer from '../http/HttpServer';
import MockSocketServer from '../socket/SocketServer';
import { ENDPOINTS } from '../Constants';

const mockHttpServer = {
    socketServer: new MockSocketServer(null),
    start: jest.fn(),
}

jest.mock('express');
jest.mock("../socket/SocketServer");
jest.mock('../http/HttpServer', () =>
    jest.fn<MockHttpServer>().mockImplementation(() => mockHttpServer)
)

describe('App', () => {
    it('can be created', () => {
        const testPort = 99;
        const app = new App(testPort);
        
        expect(app).toBeInstanceOf(App)
        expect(app).toHaveProperty('express');
        expect(app).toHaveProperty('httpServer')
        expect(app).toHaveProperty('io', mockHttpServer.socketServer);

        expect(MockHttpServer as any).toHaveBeenCalledWith(testPort, mockExpress(), ENDPOINTS);
        expect(mockHttpServer.start).toHaveBeenCalled();
    });
});