const fs = require('fs');
const uuidv4 = require('uuid/v4');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', onWebRequest);

io.on('connection', onConnectionRecieved);
http.listen(3000);

function onWebRequest(req, res) {
    res.sendFile(__dirname + "/public/index.html");
   //res.sendFile(__dirname + "/file.json");
}

const sockets = {};

function onConnectionRecieved(socket) {
    console.log("Connection recieved");
    const socketId = uuidv4();
    socket.on('disconnect', () => onDisconnect(socketId));
    socket.on('update', (payload) => updateFile(socketId, payload));

    sockets[socketId] = socket;
}

function onDisconnect(socketId) {
    if (!sockets[socketId]) {
        console.warn("Unknown socket disconnected", socket);
        return;
    }

    delete sockets[socketId];
}

function onStart() {
    console.log('listening on *:3000');
}

const ALLOW_TEXT_MESSAGES = false;
function updateFile(socketId, payload) {
    const socket = sockets[socketId];

    if (typeof payload == 'string') {
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
    }

    const newPayload = {};
    const fileContents = JSON.stringify(payload);

    fs.mkdir(__dirname + "/data", (err) => {
        if(err) {
            console.log("Error updating file", err)
            emitError(socket, "Error saving updates");
            return;
        }
        fs.writeFile(__dirname + "/data/file.json", fileContents, (err) => {
            if(err) {
                console.log("Error updating file", err)
                emitError(socket, "Error saving updates");
                return;
            }
        
            io.emit('update', fileContents);
        }); 
    })

    

}

function emitError(socket, message) {
    const payload = {
        error: message
    };
    socket.emit("update_error", JSON.stringify(payload));
}