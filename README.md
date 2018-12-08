# pied-piper

A small program to update a text file and listen for updates via `socket.io`

## Setup

`npm install`

## Usage

Run server: `npm start [port]`

Run tests: `npm test`

Run linter: `npm run lint`

HTTP usage:
```
http://localhost:8000/contents //HTTP PUT method
http://localhost:8000/contents
http://localhost:8000/contents?key=test
```

SocketIO Client usage:
```
  const io = require("socket.io-client"),
  ioClient = io.connect("http://localhost:8000");

  socket.emit('contents/put', payload, function(message, error) {});
  socket.emit('contents/get', null, function(message, error) {})
  socket.emit('contents/get', { key: jsonKeyInLastValue }, function(message, error) {})
```

## Endpoints

- REST methods for Http
- Endpoints are accessed via `{endpoint}/{method}` events for sockets
  - (E.g `contents/get`)
  - `socket.emit` callback for client is called with `(payload:string=null, error:string=false)`

Currently only endpoint is `contents` which emits `contents` socket event to all clients when changed

| Method  | Params  | Response  | Description |
| ------------- | ------------- | ------------- | ------------- |
| get  | key: string (optional)  | Last stored JSON (or key) | Retrieves the contents of the text file (at key if specified)  | 
| put  | any  | The stored value or an object with truthy `error` key on error | Replaces contents of the file with JSON representation of payload (if possible) and returns new data  |
