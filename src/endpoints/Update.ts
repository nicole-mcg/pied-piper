import fs from 'fs';

import { DATA_DIR_PATH, DATA_FILE_PATH } from '@app/Constants';
import Request from '@app/Request';
import Endpoint from '@endpoints/Endpoint';
import SocketServer from '@socket/SocketServer';

export default class UpdateEndpoint extends Endpoint {

    public get(payload: string, request: Request, server: SocketServer) {
        if (!fs.existsSync(DATA_FILE_PATH)) {
            request.onError("Error loading file");
            return;
        }

        let fileContents = fs.readFileSync(DATA_FILE_PATH).toString();

        try {
            fileContents = JSON.parse(fileContents);
        } catch (e) {
            request.onError("Error loading file");
            return;
        }

        if (!payload) {
            request.onSuccess(JSON.stringify(fileContents));
            return;
        }

        let key;
        try {
            key = JSON.parse(payload).key;
        } catch (e) {
            request.onError("Invalid key");
            return;
        }

        if (!fileContents[key]) {
            request.onError("Key does not exist");
            return;
        }

        request.onSuccess(JSON.stringify(fileContents[key]));
    }

    public put(payload: string, request: Request, server: SocketServer) {
        try {
            if (!payload) {
                return;
            }

            if (!fs.existsSync(DATA_DIR_PATH)) {
                fs.mkdirSync(DATA_DIR_PATH);
            }

            fs.writeFileSync(DATA_FILE_PATH, payload);
            server.io.emit('update', payload); // Emit to all connected
            request.onSuccess(payload);
        } catch (error) {
            console.log(`Error saving file: ${error}`);
            request.onError("Error saving data");
        }
    }

}
