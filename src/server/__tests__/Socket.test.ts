import Socket from '../Socket'
import SocketServer from '../SocketServer';

jest.mock('../SocketServer');

describe('Socket', () => {

    it('can be created', () => {
        const mockServer:SocketServer = new SocketServer(null);
        const mockIoSocket = {
            on: jest.fn()
        };
        const socket:any = new Socket(mockIoSocket, mockServer);

        expect(mockIoSocket.on).toHaveBeenCalledTimes(2);        
        expect(mockIoSocket.on).toHaveBeenCalledWith('update', socket.onUpdate)
        expect(mockIoSocket.on).toHaveBeenCalledWith('disconnect', socket.onDisconnect)

        expect(socket).toBeTruthy();
        expect(socket.ioSocket).toBe(mockIoSocket);
        expect(socket.id).toBeTruthy();
    });

    xit('can ...', () => {
    });

});