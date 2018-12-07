import mockExpress from 'express';

import App, { ENDPOINTS } from '../App'
import MockHttpServer from '../http/HttpServer';
import MockSocketServer from '../socket/SocketServer';

const httpServerStub = {
    socketServer: new MockSocketServer(null),
    start: jest.fn(),
}

jest.mock('express');
jest.mock("../socket/SocketServer");
jest.mock('../http/HttpServer', () =>
    jest.fn<MockHttpServer>().mockImplementation(() => httpServerStub)
)

describe('App', () => {
    const testPort = 99;

    let app:any;

    beforeEach(() => {
        app = new App(testPort);
    })

    it('can be created', () => {
        expect(app).toBeInstanceOf(App)
        expect(app).toHaveProperty('express');
        expect(app).toHaveProperty('httpServer')
        expect(app).toHaveProperty('io', httpServerStub.socketServer);;

        expect(MockHttpServer as any).toHaveBeenCalledWith(testPort, ENDPOINTS, mockExpress());
        expect(httpServerStub.start).toHaveBeenCalled();
    });

});