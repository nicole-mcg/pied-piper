
import App from '../App'
import Route from './../routes/Route';

describe('App', () => {

    it('can be created', () => {
        const app = new App();

        expect(app).toBeTruthy()
        expect(app.httpServer).toBeTruthy();
        expect(app.io).toBeTruthy();
    });

    it('can define a route', () => {
        const app = new App();
        app.express = {
            get: jest.fn()
        };

        const path = 'test'
        const routeHandler = jest.fn();
        app.createRoute(path, routeHandler);

        const wrappedRouteHandler = app.express.get.mock.calls[0][1];
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

});