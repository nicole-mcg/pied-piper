import fs from 'fs';
import path from 'path'

import { DATA_DIR_PATH, DATA_FILE_PATH } from './../Constants';
import Client from '../Client';
import SocketServer from '../socket/SocketServer';
import AbstractEndpoint from './AbstractEndpoint'

export default class UpdateEndpoint extends AbstractEndpoint {

    constructor() {
        super();
    }

    handleEndpoint(payload:string, client:Client, server:SocketServer) {

        try {
            if (!fs.existsSync(DATA_DIR_PATH)){
                fs.mkdirSync(DATA_DIR_PATH);
            }

            fs.writeFileSync(DATA_FILE_PATH, payload)
            this.emitUpdate(payload, server);
        } catch (error) {
            console.log(`Error saving file: ${error}`)                
            client.onError('update', "Error saving data");
        }
    }

    private emitUpdate(payload, server:SocketServer) {
        server.io.emit('update', payload);
    }
}