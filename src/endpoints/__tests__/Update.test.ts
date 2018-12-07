const path = require('path');
import MockSocket from '../../server/Socket'
import UpdateEndpoint from '../Update';
import { makeDirAndWriteToFile } from '../../helpers/FileHelper';

jest.mock('../../helpers/FileHelper', () => ({
    makeDirAndWriteToFile: jest.fn().mockReturnValue(Promise.resolve())
}));
jest.mock('../../server/Socket');

describe('UpdateEndpoint', () => {

    const parentDir = path.normalize(__dirname+"/..");
    const dirPath = parentDir + "/../../data";
    const filePath = parentDir + "/../../data/file.json";

    let updateEndpoint:any;
    let mockServer;
    let mockSocket;

    const payload = "{}";

    beforeEach(() => {
        updateEndpoint = new UpdateEndpoint();
        mockServer = {
            io: {
                emit: jest.fn(),
            }
        };
        mockSocket = new MockSocket({}, mockServer.app);
    });

    it('can recieve an update from a socket', () => {
        const promise = updateEndpoint.handleEndpoint(payload, mockSocket, mockServer)
            .then(() => {
                expect(makeDirAndWriteToFile).toHaveBeenCalledWith(dirPath, filePath, payload);
                expect(mockServer.io.emit).toHaveBeenCalledWith('update', payload);
            });

        expect(promise).resolves;        
    });

    it('will emit error to socket on update failure', () => {
        (makeDirAndWriteToFile as any).mockReturnValueOnce(Promise.reject())

        const promise = updateEndpoint.handleEndpoint(payload, mockSocket, mockServer)
            .catch(() => {
                expect(makeDirAndWriteToFile).toHaveBeenCalledWith(dirPath, filePath, payload);                
                expect(mockSocket.emitError).toHaveBeenCalledWith("update", "Invalid request data");
            })

        expect(promise).rejects;
    });

    function createMockSocket(stub={}):any {
        return new MockSocket(stub, mockServer.app);
    }
})