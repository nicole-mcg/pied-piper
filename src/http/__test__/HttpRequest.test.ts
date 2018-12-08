import Request from '../../Request';
import HttpRequest from '../HttpRequest';

describe('HttpRequest', () => {
    const req: any = {};
    const res: any = { send: jest.fn() };
    const app: any = {};

    let httpRequest;

    beforeEach(() => {
        httpRequest = new HttpRequest(app, req, res);
    });

    it('can be created', () => {
        expect(httpRequest).toBeInstanceOf(Request);
        expect(httpRequest).toHaveProperty('req', req);
        expect(httpRequest).toHaveProperty('req', req);
        expect(httpRequest).toHaveProperty('app', app);
    });

    it('can send report success back to the client', () => {
        const payload = 'test';

        httpRequest.onSuccess(payload);

        expect(res.send).toHaveBeenCalledWith(payload);
    });

    it('can send an error back to the client', () => {
        const errorMessage = 'test';
        const expectedPayload = JSON.stringify({ error: errorMessage });

        httpRequest.onError(errorMessage);

        expect(res.send).toHaveBeenCalledWith(expectedPayload);
    });
});
