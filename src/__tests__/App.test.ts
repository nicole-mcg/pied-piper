
import App from '../App'
import Route from './../routes/Route';

describe('App', () => {

    it('can be created', () => {
        const app = new App();

        expect(app).toBeTruthy()
        expect(app.server).toBeTruthy();
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
    });

    it('can add multiple routes at once', () => {
        const app = new App();
        const createRoute = jest.fn();
        app.createRoute = createRoute;

        const firstRouteHandler = jest.fn();
        const secondRouteHandler = jest.fn();

        const firstRoute = new Route('first', firstRouteHandler);
        const secondRoute = new Route('second', secondRouteHandler);
        app.createRoutes([firstRoute, secondRoute]);

        const firstCallPath = createRoute.mock.calls[0][0];
        const firstCallHandler = createRoute.mock.calls[0][1];
        expect(firstCallPath).toEqual(firstRoute.path);
        expect(firstCallHandler).toCallFunction(firstRouteHandler);

        const secondCallPath = createRoute.mock.calls[1][0];
        const secondCallHandler = createRoute.mock.calls[1][1];
        expect(secondCallPath).toEqual(secondRoute.path);
        expect(secondCallHandler).toCallFunction(secondRouteHandler);
    });

});