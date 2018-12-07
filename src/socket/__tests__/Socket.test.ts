import IO from 'socket.io'

import Socket from '../Socket'
import MockSocketServer from '../SocketServer';

jest.mock('socket.io')
jest.mock('../SocketServer');
jest.mock('uuid/v4', () => (
    () => "test"
));

describe('Socket', () => {

    let socket:any = null;

    beforeEach(() => {
        socket = new Socket(IO(), new MockSocketServer(null, {}));
    })

    afterEach(() => {
        jest.restoreAllMocks();
    })

    it('can be created', () => {
        expect(socket).toBeTruthy();
        expect(socket.ioSocket).toBe(IO());
        expect(socket.id).toEqual('test');

        expect(IO().on).toHaveBeenCalledWith('update', socket.onUpdate)
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

        expect(IO().emit).toHaveBeenCalledWith('onerror', expectedPayload);
    });

});