import Socket from '../Socket'
import MockSocketServer from '../SocketServer';

jest.mock('../SocketServer');

describe('Socket', () => {

    let socket:any = null;
    const mockIoSocket = {
        on: jest.fn(),
        emit: jest.fn(),
    };

    beforeEach(() => {
        socket = new Socket(mockIoSocket, new MockSocketServer(null));
    })

    afterEach(() => {
        jest.restoreAllMocks();
    })

    it('can be created', () => {
        expect(mockIoSocket.on).toHaveBeenCalledTimes(2);        
        expect(mockIoSocket.on).toHaveBeenCalledWith('update', socket.onUpdate)
        expect(mockIoSocket.on).toHaveBeenCalledWith('disconnect', socket.onDisconnect)

        expect(socket).toBeTruthy();
        expect(socket.ioSocket).toBe(mockIoSocket);
        expect(socket.id).toBeTruthy();
    });

    it('will notify the server on update', () => {
        const payload = "{}";
        socket.server.onUpdate = jest.fn();

        socket.onUpdate(payload);

        expect(socket.server.onUpdate).toHaveBeenCalledWith(payload, socket);
    });

    it('will notify the server on disconnect', () => {
        socket.server.onDisconnect = jest.fn();

        socket.onDisconnect();

        expect(socket.server.onDisconnect).toHaveBeenCalledWith(socket);
    });

    it('can emit an error', () => {
        const endpoint:string = "update";
        const message:string = "Could not update";
        const expectedPayload = {
            endpoint,
            message,
        }

        socket.emitError(endpoint, message);

        expect(mockIoSocket.emit).toHaveBeenCalledWith('onerror', JSON.stringify(expectedPayload));
    });

});