
import App from '../App'
import SocketServer from '../server/SocketServer';

jest.mock('express', () => {
    return require('jest-express');
});
jest.mock('http');

jest.mock("../server/SocketServer");

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