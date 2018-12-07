import mockUuidv4 from 'uuid/v4'
import mockIo from 'socket.io'

import MockSocketServer from '../SocketServer';
import Socket from '../Socket'

jest.mock('socket.io')
jest.mock('uuid/v4', () => (
    () => "test"
));

jest.mock('../SocketServer');

describe('Socket', () => {

    let socket:any = null;

    beforeEach(() => {
        socket = new Socket(mockIo(), new MockSocketServer(null, {}));
    })

    afterEach(() => {
        jest.restoreAllMocks();
    })

    it('can be created', () => {
        expect(socket).toBeTruthy();
        expect(socket.ioSocket).toBe(mockIo());
        expect(socket.id).toEqual(mockUuidv4());

        expect(mockIo().on).toHaveBeenCalledWith('update', socket.onUpdate)
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

        expect(mockIo().emit).toHaveBeenCalledWith('onerror', expectedPayload);
    });

});