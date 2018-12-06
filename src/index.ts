// const fs = require('fs');
// const uuidv4 = require('uuid/v4');

// var App = require('express');
// var Http = require('http');
// var IO = require('socket.io');

import * as fs from 'fs'
import * as uuidv4 from 'uuid/v4';

import * as App from 'express';
import * as Http from 'http';
import * as IO from 'socket.io';

const app:any = App();
const http:any = new Http.Server(app);
const io:any = IO(http);

app.get('/', onWebRequest);

io.on('connection', onConnectionRecieved);
http.listen(3000);

function onWebRequest(req:any, res:any) {
    res.sendFile(__dirname + "/public/index.html");
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

    fs.mkdir(__dirname + "/data", (err:any) => {
        if(err) {
            console.log("Error updating file", err)
            emitError(socket, "Error saving updates");
            return;
        }
        fs.writeFile(__dirname + "/data/file.json", fileContents, (err:any) => {
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