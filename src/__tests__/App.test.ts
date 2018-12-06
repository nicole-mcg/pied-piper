
import App from '../App'

describe('App', () => {

    it('can be created', () => {
        const app = new App();

        expect(app).toBeTruthy()
        expect(app.server).toBeTruthy();
        expect(app.io).toBeTruthy();
    });

});