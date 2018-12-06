const fs = require('fs');
import FileHelper from '../FileHelper'

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

var mockFs = new MockFs();//var so variable is hoisted
jest.mock('fs', mockFs);

describe('FileHelper', () => {

    afterEach(() => {
        jest.resetAllMocks();
    })

    describe('makeDirIfNotExists', () => {
        it('will resolve if a directory is created', () => {
            const path = 'test';
            expect(FileHelper.makeDirIfNotExists(path)).resolves;
        });

        it('will resolve if the directory already exists', () => {
            const path = 'test';
            mockFs.shouldFail({
                code: "EEXIST"
            });
            expect(FileHelper.makeDirIfNotExists(path)).resolves;
        });
    
        it('will reject if a directory is not created', () => {
            const path = 'test';
            mockFs.shouldFail();
            expect(FileHelper.makeDirIfNotExists(path)).rejects;
        });
    });

    describe('writeToFile', () => {

        it('will resolve if the file is written to', () => {
            const path = 'test';
            const contents = ""
            expect(FileHelper.writeToFile(path, contents)).resolves;
        });
        
        it('will reject if the file is not written to', () => {
            const path = 'test';
            const contents = ""
            mockFs.shouldFail();
            expect(FileHelper.writeToFile(path, contents)).rejects;
        });

    })

})