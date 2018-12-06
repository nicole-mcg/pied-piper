const fs = require('fs');

export default {
    makeDirIfNotExists(path:string):Promise<undefined> {
        return new Promise((resolve, reject) => {
            fs.mkdir(path, (err:any) => {
                if(err && err.code != "EEXIST") {
                    reject();
                    return;
                }
        
                resolve();
            })
        })
    },
    
    writeToFile(path:string, contents:string):Promise<undefined> {
        return new Promise((resolve, reject) => {
            fs.writeFile(__dirname + "/../data/file.json", contents, (err:any) => {
                if(err) {
                    reject();
                    return;
                }
            
                resolve();
            }); 
        })
    }
}