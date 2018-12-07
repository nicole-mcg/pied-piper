import mockUuidv4 from 'uuid/v4'
import mockIo from 'socket.io'

import Client from '../../Client';
import MockSocketServer from '../SocketServer';
import Socket from '../Socket'
import { METHODS } from '../../Constants';

jest.mock('socket.io')
jest.mock('uuid/v4', () => (
    () => "test"
));

jest.mock('../SocketServer');

describe('Socket', () => {
    const mockEndpoint = { put: jest.fn() };
    const mockServer:any = new MockSocketServer(null);
    mockServer.endpoints = { test: mockEndpoint };
    mockServer.handleEndpoint = jest.fn();

    let socket:any = null;

    beforeEach(() => {
        socket = new Socket(mockIo(), mockServer);
    })

    it('can be created', () => {
        expect(socket).toBeInstanceOf(Client);
        expect(socket).toHaveProperty('ioSocket', mockIo());
        expect(socket).toHaveProperty('id', mockUuidv4());

        METHODS.forEach((method) => {
            expect(mockIo().on).toHaveBeenCalledWith(`test/${method.toLowerCase()}`, expect.any(Function));
        })
    });

    it('will notify the server on update', () => {
        const endpoint = 'update';
        const payload = "{}";
        const method = "null"
        socket.server.handleEndpoint = jest.fn();

        socket.onRequest(`${endpoint}`, payload, method);

        expect(socket.server.handleEndpoint).toHaveBeenCalledWith(endpoint, payload, socket, method);
    });

    it('can emit an error', () => {
        const endpoint:string = "update";
        const message:string = "Could not update";
        const expectedPayload = JSON.stringify({ endpoint, message })

        socket.onError(endpoint, message);

        expect(mockIo().emit).toHaveBeenCalledWith('onerror', expectedPayload);
    });

});