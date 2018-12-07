
import App from '../App'
import SocketServer from '../socket/SocketServer';
import mockExpress from 'jest-express';

jest.mock('http');
jest.mock('express', () => jest.fn().mockImplementation(() => {
    return mockExpress;
}));

jest.mock("../socket/SocketServer");

describe('App', () => {
    const testPort = 99;

    let app:any;

    beforeEach(() => {
        app = new App(testPort);
    })

    it('can be created', () => {
        expect(app).toBeTruthy()
        expect(app.port).toBe(testPort);
        expect(app.httpServer).toBeTruthy();
        expect(app.io).toBeTruthy();
        expect(SocketServer as any).toHaveBeenCalled();
    });

    it('can be started', () => {
        app.httpServer.listen = jest.fn();
        app.start();
        expect(app.httpServer.listen).toHaveBeenCalledWith(testPort);
    });

});