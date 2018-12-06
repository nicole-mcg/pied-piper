import * as http from 'http'

import MockSocket from '../Socket'
import SocketServer from '../SocketServer'

jest.mock('http');
jest.mock('../Socket');

const ioStub = {
    on: jest.fn(),
    emit: jest.fn()
}
jest.mock('socket.io', () => (
    (httpServer) => ioStub
));

describe('SocketServer', () => {

    let socketServer:any = null;

    beforeEach(() => {
        const mockHttpServer:HttpServer = new http.Server();
        socketServer = new SocketServer(mockHttpServer);
    });

    afterEach(() => {
        jest.resetAllMocks();
    })

    it('can be created', () => {
        expect(socketServer).toBeTruthy();
        expect(socketServer.io).toBeTruthy();
        expect(ioStub.on).toBeCalledWith('connection', socketServer.onConnectionRecieved);
    });

    it('can accept a socket', () => {
        const ioSocketStub = {};
        const expectedSocket:MockSocket = createMockSocket(ioSocketStub);

        const socket = socketServer.onConnectionRecieved(ioSocketStub);
        expect(socket).toEqual(expectedSocket);
    });

    it('can validate a payload', () => {
        const validPayload = "{}";
        expect(socketServer.validatePayload(validPayload)).toBe(true);

        const invalidPayload = "invalid json";
        expect(socketServer.validatePayload(invalidPayload)).toBe(false);
    });

    it('can emit an update to its connections', () => {
        const payload = "{}";
        socketServer.emitUpdate(payload);
        expect(ioStub.emit).toHaveBeenCalledWith('update', payload);
    });

    it('can recieve an update from a socket', () => {
        const payload = "{}";
        const mockSocket = createMockSocket();
        socketServer.emitUpdate = jest.fn();

        const success = socketServer.onUpdate(payload, mockSocket);

        expect(success).toBe(true);
        expect(socketServer.emitUpdate).toHaveBeenCalledWith(payload);
    });

    it('will emit error to socket on update failure', () => {
        const invalidPayload = "invalid json";
        const mockSocket = createMockSocket();
        mockSocket.emitError = jest.fn();

        const success = socketServer.onUpdate(invalidPayload, mockSocket);

        expect(success).toBe(false);
        expect(mockSocket.emitError).toHaveBeenCalledWith("update", "Invalid request data");
    });

    function createMockSocket(stub={}):any {
        return new MockSocket(stub, socketServer.app);
    }

});