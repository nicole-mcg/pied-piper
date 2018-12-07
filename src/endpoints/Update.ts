import fs from 'fs';

import { DATA_DIR_PATH, DATA_FILE_PATH } from './../Constants';
import Client from '../Client';
import SocketServer from '../socket/SocketServer';
import Endpoint from './Endpoint'

export default class UpdateEndpoint extends Endpoint {

    get(payload:string, client:Client, server:SocketServer) {
        if (!payload) {
            if (!fs.existsSync(DATA_FILE_PATH)) {
                client.onError("Error loading file");
                return;
            }

            const fileContents = fs.readFileSync(DATA_FILE_PATH);
            client.onSuccess(fileContents.toString());
            return;
        }

        try {
            if (!fs.existsSync(DATA_DIR_PATH)){
                fs.mkdirSync(DATA_DIR_PATH);
            }

            fs.writeFileSync(DATA_FILE_PATH, payload)
            server.io.emit('update', payload);
            client.onSuccess(payload);
        } catch (error) {
            console.log(`Error saving file: ${error}`)                
            client.onError("Error saving data");
        }
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