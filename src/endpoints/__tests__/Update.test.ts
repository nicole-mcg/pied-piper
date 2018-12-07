import fs from 'fs'
import path from 'path'

import MockSocket from '../../socket/Socket'
import UpdateEndpoint from '../Update';

jest.mock('../../socket/Socket');
jest.mock('fs', () => {
    let error:any = null;
    return {
        existsSync: jest.fn().mockImplementation((path) => {
            if (error) {
                throw new Error();
            }
        }),
        mkdirSync: jest.fn(),
        writeFileSync: jest.fn(),
        shouldFail: (err={}) => error = err,
    }
});

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

    afterEach(() => {
        jest.restoreAllMocks();
    })

    it('can recieve an update from a socket', (done) => {
        try {
            updateEndpoint.handleEndpoint(payload, mockSocket, mockServer)
            expect(fs.existsSync).toHaveBeenCalledWith(dirPath);            
            expect(fs.mkdirSync).toHaveBeenCalledWith(dirPath);
            expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, payload);
            expect(mockServer.io.emit).toHaveBeenCalledWith('update', payload);
            done();
        } catch(e) {
            done.fail(e);
        }
    });

    it('will emit error to socket on update failure', (done) => {

        (fs as any).shouldFail();
        try {
            updateEndpoint.handleEndpoint(payload, mockSocket, mockServer)
            expect(fs.existsSync).toHaveBeenCalledWith(dirPath);
            expect(mockSocket.emitError).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalled();
            done();
        } catch (e) {
            done.fail(e)
        }
    });
})