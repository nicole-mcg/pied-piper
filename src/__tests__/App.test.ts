import App, { ENDPOINTS } from '../App'
import SocketServer from '../socket/SocketServer';

jest.mock('http');
jest.mock('express', () => {
    return jest.fn().mockImplementation(() => {
        return {
            get: jest.fn()
        }
    })
});

jest.mock("../socket/SocketServer");
jest.mock("../endpoints/Update");

describe('App', () => {
    const testPort = 99;

    let app:any;

    beforeEach(() => {
        app = new App(testPort);
    })

    it('can be created', () => {
        expect(app).toBeInstanceOf(App)
        expect(app).toHaveProperty('port', testPort);
        expect(app).toHaveProperty('express');
        expect(app).toHaveProperty('httpServer')
        expect(app).toHaveProperty('io')

        expect(SocketServer as any).toHaveBeenCalledWith(app.httpServer, ENDPOINTS);
        Object.keys(ENDPOINTS).forEach((endpoint) => {
            expect(app.express.get).toHaveBeenCalledWith(`/${endpoint}`, expect.any(Function))
        })
    });

    it('can be started', () => {
        app.httpServer.listen = jest.fn();
        app.start();
        expect(app.httpServer.listen).toHaveBeenCalledWith(testPort);
    });

});