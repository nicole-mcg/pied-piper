const fs = require('fs');
import {
    makeDirIfNotExists,
    writeToFile,
    makeDirAndWriteToFile,
} from '../FileHelper'

class MockFs {
    private error:object;

    constructor() {
        this.error = null;
    }
    
    mkdir(path, callback) {
        callback(this.error)
    }

    writeToFile(path, contents, callback) {
        callback(this.error)
    }

    shouldFail(error={}) {
        this.error = error;
    }

}

var mockFs = new MockFs();
jest.mock('fs', mockFs);

describe('FileHelper', () => {

    const path = 'test';
    const contents = "";

    afterEach(() => {
        jest.restoreAllMocks();
    })

    describe('makeDirIfNotExists', () => {
        it('will resolve if a directory is created', () => {
            expect(makeDirIfNotExists(path)).resolves;
        });

        it('will resolve if the directory already exists', () => {
            mockFs.shouldFail({
                code: "EEXIST"
            });
            expect(makeDirIfNotExists(path)).resolves;
        });
    
        it('will reject if a directory is not created', () => {
            mockFs.shouldFail();
            expect(makeDirIfNotExists(path)).rejects;
        });
    });

    describe('writeToFile', () => {

        it('will resolve if the file is written to', () => {
            expect(writeToFile(path, contents)).resolves;
        });
        
        it('will reject if the file is not written to', () => {
            mockFs.shouldFail();
            expect(writeToFile(path, contents)).rejects;
        });

    })

    describe('makeDirAndWriteToFile', () => {

        const dirPath = '';
        const filePath = '';
        

        it('will resolve if the file is written to', () => {
            expect(makeDirAndWriteToFile(dirPath, filePath, contents)).resolves;
        });
        
        it('will reject if the file is not written to', () => {
            mockFs.shouldFail();
            expect(makeDirAndWriteToFile(dirPath, filePath, contents)).rejects;
        });

    })

})