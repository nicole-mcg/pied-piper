import fs from 'fs'
import path from 'path'

import { DATA_DIR_PATH, DATA_FILE_PATH } from '../../Constants'
import MockSocket from '../../socket/Socket'
import UpdateEndpoint from '../Update';


jest.mock('fs', () => {
    let error:any = null;
    return {
        shouldFail: (err={}) => error = err,
        existsSync: jest.fn().mockImplementation((path) => {
            if (error) {
                throw new Error();
            }
        }),
        mkdirSync: jest.fn(),
        writeFileSync: jest.fn(),
    }
});

jest.mock('../../socket/Socket');

describe('UpdateEndpoint', () => {
    const mockSocket = new MockSocket({}, null);
    const mockServer = { 
        io: { emit: jest.fn() }
    }

    let updateEndpoint:any;

    beforeEach(() => {
        updateEndpoint = new UpdateEndpoint();
    });

    it('can recieve an update from a socket', () => {
        (fs as any).shouldFail(false);
        const payload = "{}";

        updateEndpoint.handleEndpoint(payload, mockSocket, mockServer)

        expect(fs.existsSync).toHaveBeenCalledWith(DATA_DIR_PATH);            
        expect(fs.mkdirSync).toHaveBeenCalledWith(DATA_DIR_PATH);
        expect(fs.writeFileSync).toHaveBeenCalledWith(DATA_FILE_PATH, payload);
        expect(mockServer.io.emit).toHaveBeenCalledWith('update', payload);
    });

    it('will emit error to socket on update failure', (done) => {
        (fs as any).shouldFail();
        try {
            updateEndpoint.handleEndpoint("{}", mockSocket, mockServer)

            expect(fs.existsSync).toHaveBeenCalledWith(DATA_DIR_PATH);
            expect(mockSocket.onError).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalled();
            done();
        } catch (e) {
            done.fail(e)
        }
    });
})