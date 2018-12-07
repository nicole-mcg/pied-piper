import Socket from '../Socket'
import MockSocketServer from '../SocketServer';

jest.mock('../SocketServer');
jest.mock('uuid/v4', () => (
    () => "test"
));

describe('Socket', () => {

    let socket:any = null;
    const mockIoSocket = {
        on: jest.fn(),
        emit: jest.fn(),
    };

    beforeEach(() => {
        socket = new Socket(mockIoSocket, new MockSocketServer(null, {}));
    })

    afterEach(() => {
        jest.restoreAllMocks();
    })

    it('can be created', () => {
        expect(socket).toBeTruthy();
        expect(socket.ioSocket).toBe(mockIoSocket);
        expect(socket.id).toEqual('test');

        expect(mockIoSocket.on).toHaveBeenCalledWith('update', socket.onUpdate)
    });

    it('will notify the server on update', () => {
        const payload = "{}";
        socket.server.handleEndpoint = jest.fn();

        socket.onUpdate(payload);

        expect(socket.server.handleEndpoint).toHaveBeenCalledWith('update', payload, socket);
    });

    it('can emit an error', () => {
        const endpoint:string = "update";
        const message:string = "Could not update";
        const expectedPayload = JSON.stringify({ endpoint, message })

        socket.emitError(endpoint, message);

        expect(mockIoSocket.emit).toHaveBeenCalledWith('onerror', expectedPayload);
    });

});