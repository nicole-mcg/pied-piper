import mockUuidv4 from 'uuid/v4';

import Connection from '@app/Connection';
import { REQUEST_METHODS } from '@app/Constants';
import SocketConnection from '@app/socket/SocketConnection';

jest.mock('uuid/v4', () => (
    () => "test"
));

describe('SocketConnection', () => {
    const mockServer: any = { onDisconnect: jest.fn() };
    const mockIo = { on: jest.fn(), emit: jest.fn() };
    const mockEndpoint = { put: jest.fn() };
    const mockApp: any = { onRequest: jest.fn() };
    mockApp.endpoints = { test: mockEndpoint };
    mockApp.handleEndpoint = jest.fn();

    let socket: any = null;

    beforeEach(() => {
        socket = new SocketConnection(mockApp, mockServer, mockIo);
    });

    it('can be created', () => {
        expect(socket).toBeInstanceOf(Connection);
        expect(socket).toHaveProperty('server', mockServer);
        expect(socket).toHaveProperty('id', mockUuidv4());

        expect(mockIo.on).toHaveBeenCalledWith("disconnect", socket.onDisconnect);
        REQUEST_METHODS.forEach((method) => {
            expect(mockIo.on).toHaveBeenCalledWith(`test/${method.toLowerCase()}`, expect.any(Function));
        });
    });

    it('will notify the app on update', () => {
        const endpoint = 'endpoint';
        const payload = "{}";
        const method = "null";

        socket.onRequest(`${endpoint}`, payload, method);

        expect(socket.app.onRequest).toHaveBeenCalledWith(endpoint, payload, socket, method);
    });

    it('will notify the server on disconnect', () => {
        socket.onDisconnect();
        expect(socket.server.onDisconnect).toHaveBeenCalledWith(socket.id);
    });

    it('can emit an error', () => {
        const message: string = "Could not update";
        socket.acknowledge = jest.fn();

        socket.onError(message);

        expect(socket.acknowledge).toHaveBeenCalledWith(null, message);
    });

});
