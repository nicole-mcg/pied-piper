import fs from 'fs';
import path from 'path'

import { DATA_DIR_PATH, DATA_FILE_PATH } from './../Constants';
import Socket from '../socket/Socket';
import SocketServer from '../socket/SocketServer';
import AbstractEndpoint from './AbstractEndpoint'

export default class UpdateEndpoint extends AbstractEndpoint {

    constructor() {
        super();
    }

    handleEndpoint(payload:string, socket:Socket, server:SocketServer) {

        try {
            if (!fs.existsSync(DATA_DIR_PATH)){
                fs.mkdirSync(DATA_DIR_PATH);
            }

            fs.writeFileSync(DATA_FILE_PATH, payload)
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