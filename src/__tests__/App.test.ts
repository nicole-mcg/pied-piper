
import app from '../App'

describe('App', () => {

    it('is created with a server', () => {
        expect(app).toBeTruthy()
        expect(app.server).toBeTruthy();
    });

});