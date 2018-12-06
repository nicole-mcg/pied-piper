const fs = require('fs');

export function makeDirIfNotExists(path:string):Promise<any> {
    return new Promise((resolve, reject) => {
        fs.mkdir(path, (err:any) => {
            if(err && err.code != "EEXIST") {
                reject(err);
                return;
            }
    
            resolve();
        })
    })
}

export function writeToFile(path:string, contents:string):Promise<any> {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, contents, (err:any) => {
            if(err) {
                reject(err);
                return;
            }
        
            resolve();
        }); 
    })
}

export function makeDirAndWriteToFile(dirPath, filePath, fileContents):Promise<any> {
    return new Promise((resolve, reject) => {
        makeDirIfNotExists(dirPath)
            .then(() => {
                writeToFile(filePath, fileContents)
                    .then(resolve)
                    .catch((err) => {
                        console.log(`Error saving file: ${err}`)
                        reject()
                    });
            }).catch((err) => {
                console.log(`Error creating data folder: ${err}`)
                reject()
            });
    })
}