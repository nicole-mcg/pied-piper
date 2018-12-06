
import App from '../App'
import Route from './../routes/Route';

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

    it('can define a route', () => {
        const app = new App();
        const mockGet = jest.fn();
        app.express.get = mockGet;

        const path = 'test'
        const routeHandler = jest.fn();
        app.createRoute(path, routeHandler);

        const wrappedRouteHandler = mockGet.mock.calls[0][1];
        expect(wrappedRouteHandler).toCallFunction(routeHandler);
        expect(app.routes).toHaveProperty(path, wrappedRouteHandler);
    });

    it('can add multiple routes at once', () => {
        const app = new App();
        const createRoute = jest.fn();
        app.createRoute = createRoute;

        const firstRoute = new Route('first', jest.fn());
        const secondRoute = new Route('second', jest.fn());
        app.createRoutes([firstRoute, secondRoute]);
        
        expect(createRoute.mock.calls[0]).toEqual([firstRoute.path, firstRoute.handler]);
        expect(createRoute.mock.calls[1]).toEqual([secondRoute.path, secondRoute.handler]);
    });

    it('can be started', () => {
        const port = 1;
        const app = new App(port);
        app.httpServer.listen = jest.fn();

        app.start();

        expect(app.httpServer.listen).toHaveBeenCalledWith(port);
    });

});