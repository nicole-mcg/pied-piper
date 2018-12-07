import fs from 'fs';

import { DATA_DIR_PATH, DATA_FILE_PATH } from './../Constants';
import Client from '../Client';
import SocketServer from '../socket/SocketServer';
import Endpoint from './Endpoint'

export default class UpdateEndpoint extends Endpoint {

    get(payload:string, client:Client, server:SocketServer) {
        if (!fs.existsSync(DATA_FILE_PATH)) {
            client.onError("Error loading file");
            return;
        }

        let fileContents = fs.readFileSync(DATA_FILE_PATH).toString();

        try {
            fileContents = JSON.parse(fileContents);
        } catch (e) {
            client.onError("Error loading file");
            return;
        }

        if (!payload) {           
            client.onSuccess(JSON.stringify(fileContents));
            return;
        }

        let key;
        try {
            key = JSON.parse(payload).key
        } catch (e) {
            client.onError("Invalid key");
            return;
        }

        if (!fileContents[key]) {
            client.onError("Key does not exist");
            return;
        }

        client.onSuccess(JSON.stringify(fileContents[key]));
    }
    
    put(payload:string, client:Client, server:SocketServer) {
        try {
            if (!fs.existsSync(DATA_DIR_PATH)){
                fs.mkdirSync(DATA_DIR_PATH);
            }

            fs.writeFileSync(DATA_FILE_PATH, payload)
            server.io.emit('update', payload); // Emit to all connected
            client.onSuccess(payload);
        } catch (error) {
            console.log(`Error saving file: ${error}`)                
            client.onError("Error saving data");
        }
    }

}