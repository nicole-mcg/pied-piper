
import App from '../App'

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

        expect(app.express.get).toHaveBeenCalledWith(path, routeHandler);
    });

});