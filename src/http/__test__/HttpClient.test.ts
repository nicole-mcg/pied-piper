import Client from '../../Client';
import HttpClient from '../HttpClient';

describe('HttpClient', () => {
    const req: any = {};
    const res: any = { send: jest.fn() };
    const app: any = {};

    let httpClient;

    beforeEach(() => {
        httpClient = new HttpClient(app, req, res);
    });

    it('can be created', () => {
        expect(httpClient).toBeInstanceOf(Client);
        expect(httpClient).toHaveProperty('req', req);
        expect(httpClient).toHaveProperty('req', req);
        expect(httpClient).toHaveProperty('app', app);
    });

    it('can send report success back to the client', () => {
        const payload = 'test';

        httpClient.onSuccess(payload);

        expect(res.send).toHaveBeenCalledWith(payload);
    });

    it('can send an error back to the client', () => {
        const errorMessage = 'test';
        const expectedPayload = JSON.stringify({ error: errorMessage });

        httpClient.onError(errorMessage);

        expect(res.send).toHaveBeenCalledWith(expectedPayload);
    });
});
