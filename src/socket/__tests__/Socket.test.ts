import mockIo from 'socket.io';
import mockUuidv4 from 'uuid/v4';

import Client from '../../Client';
import { METHODS } from '../../Constants';
import Socket from '../Socket';
import MockSocketServer from '../SocketServer';

jest.mock('socket.io');
jest.mock('uuid/v4', () => (
    () => "test"
));

jest.mock('../SocketServer');

describe('Socket', () => {
    const mockEndpoint = { put: jest.fn() };
    const mockServer: any = new MockSocketServer(null);
    mockServer.endpoints = { test: mockEndpoint };
    mockServer.handleEndpoint = jest.fn();

    let socket: any = null;

    beforeEach(() => {
        socket = new Socket(mockIo(), mockServer);
    });

    it('can be created', () => {
        expect(socket).toBeInstanceOf(Client);
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
        socket.server.handleEndpoint = jest.fn();

        socket.onRequest(`${endpoint}`, payload, method);

        expect(socket.server.handleEndpoint).toHaveBeenCalledWith(endpoint, payload, socket, method);
    });

    it('can emit an error', () => {
        const message: string = "Could not update";

        socket.onError(message);

        expect(mockIo().emit).toHaveBeenCalledWith('onerror', message);
    });

});
