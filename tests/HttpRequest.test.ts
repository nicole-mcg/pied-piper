import Connection from '@app/Connection';
import HttpConnection from '@app/http/HttpConnection';

describe('HttpRequest', () => {
    const mockQuery = { test: 1 };
    const req: any = {
        query: mockQuery,
    };
    const res: any = { send: jest.fn() };
    const app: any = {};

    let httpRequest;

    beforeEach(() => {
        httpRequest = new HttpConnection(app, req, res);
    });

    it('can be created', () => {
        expect(httpRequest).toBeInstanceOf(Connection);
        expect(httpRequest).toHaveProperty('app', app);
        expect(httpRequest).toHaveProperty('res', res);
        expect(httpRequest).toHaveProperty('payload', JSON.stringify(mockQuery));
    });

    it('can send report success back to the request', () => {
        const payload = 'test';

        httpRequest.onSuccess(payload);

        expect(res.send).toHaveBeenCalledWith(payload);
    });

    it('can send an error back to the request', () => {
        const errorMessage = 'test';
        const expectedPayload = JSON.stringify({ error: errorMessage });

        httpRequest.onError(errorMessage);

        expect(res.send).toHaveBeenCalledWith(expectedPayload);
    });
});
