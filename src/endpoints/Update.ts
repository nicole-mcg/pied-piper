const path = require('path');

import Socket from '../socket/Socket';
import SocketServer from '../socket/SocketServer';

import AbstractEndpoint from './AbstractEndpoint'

import { makeDirAndWriteToFile } from '../helpers/FileHelper';

export default class UpdateEndpoint extends AbstractEndpoint {

    constructor() {
        super();
    }

    handleEndpoint(payload:string, socket:Socket, server:SocketServer) {
        const dirPath = __dirname + "/../../data";
        const filePath = __dirname + "/../../data/file.json";

        return makeDirAndWriteToFile(dirPath, filePath, payload)
            .then(() => this.emitUpdate(payload, server))
            .catch(() => this.onSaveError(socket));
    }

    private emitUpdate(payload, server:SocketServer) {
        server.io.emit('update', payload);
    }

    private onSaveError(socket) {
        socket.emitError('update', "Error saving data");
    }

}