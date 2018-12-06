
import App from '../App'

jest.mock('express', () => {
    return require('jest-express');
});
jest.mock('http');
jest.mock('socket.io', () => (
    (httpServer) => ({})
));


jest.mock("../server/SocketServer");

describe('App', () => {

    it('can be created', () => {
        const port = 99;
        const app:any = new App(port);

        expect(app).toBeTruthy()
        expect(app.port).toBe(port);
        expect(app.httpServer).toBeTruthy();
        expect(app).toBeTruthy()
    });

    it('can be started', () => {
        const port = 1;
        const app = new App(port);
        app.httpServer.listen = jest.fn();

        app.start();

        expect(app.httpServer.listen).toHaveBeenCalledWith(port);
    });

});