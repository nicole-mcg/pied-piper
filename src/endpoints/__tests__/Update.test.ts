import fs from 'fs'
import path from 'path'

import MockSocket from '../../socket/Socket'

import Endpoint from '../AbstractEndpoint';
import UpdateEndpoint from '../Update';

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

jest.mock('../../socket/Socket');

describe('UpdateEndpoint', () => {

    const parentDir = path.normalize(__dirname+"/..");
    const dirPath = parentDir + "/../../data";
    const filePath = parentDir + "/../../data/file.json";

    const mockSocket = new MockSocket({}, null);
    const mockServer = { 
        io: { emit: jest.fn() }
    }

    let updateEndpoint:any;

    beforeEach(() => {
        updateEndpoint = new UpdateEndpoint();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    })

    it('can recieve an update from a socket', () => {
        (fs as any).shouldFail(false);
        const payload = "{}";
        
        updateEndpoint.handleEndpoint(payload, mockSocket, mockServer)

        expect(fs.existsSync).toHaveBeenCalledWith(dirPath);            
        expect(fs.mkdirSync).toHaveBeenCalledWith(dirPath);
        expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, payload);
        expect(mockServer.io.emit).toHaveBeenCalledWith('update', payload);
    });

    it('will emit error to socket on update failure', (done) => {
        (fs as any).shouldFail();
        try {
            updateEndpoint.handleEndpoint("{}", mockSocket, mockServer)

            expect(fs.existsSync).toHaveBeenCalledWith(dirPath);
            expect(mockSocket.emitError).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalled();
            done();
        } catch (e) {
            done.fail(e)
        }
    });
})