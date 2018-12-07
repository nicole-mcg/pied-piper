import fs from 'fs';

import { DATA_DIR_PATH, DATA_FILE_PATH } from './../Constants';
import Client from '../Client';
import SocketServer from '../socket/SocketServer';
import Endpoint from './Endpoint'

export default class UpdateEndpoint extends Endpoint {
    
    put(payload:string, client:Client, server:SocketServer) {
        try {
            if (!fs.existsSync(DATA_DIR_PATH)){
                fs.mkdirSync(DATA_DIR_PATH);
            }

            fs.writeFileSync(DATA_FILE_PATH, payload)
            server.io.emit('update', payload);
            client.onSuccess('update', payload);
        } catch (error) {
            console.log(`Error saving file: ${error}`)                
            client.onError('update', "Error saving data");
        }
    }

}