import mockIo from 'socket.io';
import mockUuidv4 from 'uuid/v4';

import App from '../../App';
import { METHODS } from '../../Constants';
import Request from '../../Request';
import SocketRequest from '../SocketRequest';

jest.mock('socket.io');
jest.mock('uuid/v4', () => (
    () => "test"
));

jest.mock('../../App');

describe('SocketRequest', () => {
    const mockEndpoint = { put: jest.fn() };
    const mockApp: any = new App();
    mockApp.endpoints = { test: mockEndpoint };
    mockApp.handleEndpoint = jest.fn();

    let socket: any = null;

    beforeEach(() => {
        socket = new SocketRequest(mockApp, mockIo());
    });

    it('can be created', () => {
        expect(socket).toBeInstanceOf(Request);
        expect(socket).toHaveProperty('ioSocket', mockIo());
        expect(socket).toHaveProperty('id', mockUuidv4());

        METHODS.forEach((method) => {
            expect(mockIo().on).toHaveBeenCalledWith(`test/${method.toLowerCase()}`, expect.any(Function));
        });
    });

    it('will notify the server on update', () => {
        const endpoint = 'update';
        const payload = "{}";
        const method = "null";

        socket.onRequest(`${endpoint}`, payload, method);

        expect(socket.app.onRequest).toHaveBeenCalledWith(endpoint, payload, socket, method);
    });

    it('can emit an error', () => {
        const message: string = "Could not update";

        socket.onError(message);

        expect(mockIo().emit).toHaveBeenCalledWith('onerror', message);
    });

});
