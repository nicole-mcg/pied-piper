import fs from 'fs';

import path from 'path'

import Socket from '../socket/Socket';
import SocketServer from '../socket/SocketServer';

import AbstractEndpoint from './AbstractEndpoint'

export default class UpdateEndpoint extends AbstractEndpoint {

    constructor() {
        super();
    }

    handleEndpoint(payload:string, socket:Socket, server:SocketServer) {
        const dirPath = __dirname + "/../../data";
        const filePath = __dirname + "/../../data/file.json";

        try {
            if (!fs.existsSync(dirPath)){
                fs.mkdirSync(dirPath);
            }

            fs.writeFileSync(filePath, payload)
            this.emitUpdate(payload, server);
        } catch (error) {
            console.log(`Error saving file: ${error}`)                
            this.onSaveError(socket);
        }
    }

    private emitUpdate(payload, server:SocketServer) {
        server.io.emit('update', payload);
    }

    private onSaveError(socket) {
        socket.emitError('update', "Error saving data");
    }

}