import * as fs from 'fs'

import * as express from 'express';
import * as http from 'http';
import * as IO from 'socket.io';

const uuidv4 = require('uuid/v4');

const app:any = express();
const server:any = new http.Server(app);
const io:any = IO(server);

app.get('/', onWebRequest);

io.on('connection', onConnectionRecieved);
server.listen(3000);

function onWebRequest(req:any, res:any) {
    res.sendFile("/public/index.html", { root: __dirname + "/../"});
   //res.sendFile(__dirname + "/file.json");
}

const sockets:object = {};

function onConnectionRecieved(socket:any) {
    console.log("Connection recieved");

    const socketId:string = uuidv4();
    socket.on('disconnect', () => onDisconnect(socketId));
    socket.on('update', (payload) => updateFile(socketId, payload));

    sockets[socketId] = socket;
}

function onDisconnect(socketId:string) {
    if (!sockets[socketId]) {
        console.warn("Unknown socket disconnected", socketId);
        return;
    }

    delete sockets[socketId];
}

function onStart() {
    console.log('listening on *:3000');
}

const ALLOW_TEXT_MESSAGES = false;
function updateFile(socketId:string, payload:string) {
    const socket:any = sockets[socketId];

    if (ALLOW_TEXT_MESSAGES) {
        io.emit('update', payload);
        return;
    }
    try {
        payload = JSON.parse(payload);
    } catch (e) {
        emitError(socket, "Invalid request payload");
        return;
    }

    const newPayload = {};
    const fileContents = JSON.stringify(payload);

    fs.mkdir(__dirname + "/../data", (err:any) => {
        if(err && err.code != "EEXIST") {
            console.log("Error updating file", err)
            emitError(socket, "Error saving updates");
            return;
        }
        fs.writeFile(__dirname + "/../data/file.json", fileContents, (err:any) => {
            if(err) {
                console.log("Error updating file", err)
                emitError(socket, "Error saving updates");
                return;
            }
        
            io.emit('update', fileContents);
        }); 
    })

    

}

function emitError(socket:any, message:string) {
    const payload = {
        error: message
    };
    socket.emit("update_error", JSON.stringify(payload));
}