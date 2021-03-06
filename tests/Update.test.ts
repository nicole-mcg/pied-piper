import fs from 'fs';

import { DATA_DIR_PATH, DATA_FILE_PATH } from '@app/Constants';
import UpdateEndpoint from '@endpoints/Update';

jest.mock('fs', () => {
    let doesFileExist = true;
    let isFileValid = true;
    let error: any = null;
    return {
        throwsError: (err= {}) => {
            error = err;
            return fs;
        },
        fileExists: (exists= true) => {
            doesFileExist = exists;
            return fs;
        },
        fileIsValid: (valid= true) => {
            isFileValid = valid;
            return fs;
        },
        restore: () => {
            doesFileExist = true;
            isFileValid = true;
            error = null;
        },
        existsSync: jest.fn().mockImplementation(() => doesFileExist),
        readFileSync: jest.fn().mockImplementation(() => isFileValid ? '{"test": 1}' : "err"),
        mkdirSync: jest.fn(),
        writeFileSync: jest.fn().mockImplementation(() => {
            if (error) {
                throw new Error();
            }
        }),
    };
});

describe('UpdateEndpoint', () => {
    const mockRequest = {
        onSuccess: jest.fn(),
        onError: jest.fn(),
    };
    const mockServer = {
        io: { emit: jest.fn() },
    };
    const payload = "{}";

    let updateEndpoint: any;

    beforeEach(() => {
        updateEndpoint = new UpdateEndpoint();
    });

    afterEach(() => {
        (fs as any).restore();
    });

    describe('put', () => {
        it('can update the file', () => {

            updateEndpoint.put(payload, mockRequest, mockServer);

            expect(fs.existsSync).toHaveBeenCalledWith(DATA_DIR_PATH);
            expect(fs.writeFileSync).toHaveBeenCalledWith(DATA_FILE_PATH, payload);
            expect(mockRequest.onSuccess).toHaveBeenCalledWith(payload);
            expect(mockServer.io.emit).toHaveBeenCalledWith('contents', payload);
        });

        it('will make the directory if it doesnt exist', () => {
            (fs as any).fileExists(false);
            updateEndpoint.put(payload, mockRequest, mockServer);
            expect(fs.mkdirSync).toHaveBeenCalledWith(DATA_DIR_PATH);
        });

        it('wont update if payload is falsy', () => {
            (fs as any).fileExists(false);
            updateEndpoint.put("", mockRequest, mockServer);
            expect(fs.mkdirSync).not.toHaveBeenCalled();
        });

        it('will emit error to socket on failure', (done) => {
            (fs as any).throwsError();
            try {
                updateEndpoint.put("{}", mockRequest, mockServer);

                expect(fs.existsSync).toHaveBeenCalledWith(DATA_DIR_PATH);
                expect(mockRequest.onError).toHaveBeenCalledWith(expect.any(String));
                expect(console.log).toHaveBeenCalled();
                done();
            } catch (e) {
                done.fail(e);
            }
        });
    });

    describe('get', () => {
        it('can return the file contents', () => {
            const expectedPayload = JSON.stringify({ test: 1 });
            updateEndpoint.get("", mockRequest, null);
            expect(mockRequest.onSuccess).toHaveBeenCalledWith(expectedPayload);
        });

        it('can return a value to user from key', () => {
            const payload = { key: 'test' };
            updateEndpoint.get(JSON.stringify(payload), mockRequest, null);
            expect(mockRequest.onSuccess).toHaveBeenCalledWith("1");
        });

        it('can report on error for invalid key', () => {
            const payload = { key: 'invalid' };
            updateEndpoint.get(JSON.stringify(payload), mockRequest, null);
            expect(mockRequest.onError).toHaveBeenCalledWith(expect.any(String));
        });

        it('can report on error for invalid file', () => {
            (fs as any).fileIsValid(false);
            updateEndpoint.get(null, mockRequest, null);
            expect(mockRequest.onError).toHaveBeenCalledWith(expect.any(String));
        });

        it('can report on error for non existing file', () => {
            (fs as any).fileExists(false);
            updateEndpoint.get(null, mockRequest, null);
            expect(mockRequest.onError).toHaveBeenCalledWith(expect.any(String));
        });
    });
});
