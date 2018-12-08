# pied-piper

A small program to update a text file and listen for updates via `socket.io`

## Setup

`npm install`

## Usage

Tests: `npm test`
Linter: `npm run-script lint`

Run: `npm start [port]`

### Endpoints

- REST methods for Http
- Endpoints are accessed via `{endpoint}/{method}` events for sockets
  - (E.g `contents/get`)
  - `socket.emit` callback for client is called with `(payload:string=null, error:string=false)`

Currently only endpoint is `contents` which emits `contents` socket event to all clients when changed

| Method  | Params  | Description |
| ------------- | ------------- | ------------- |
| get  | key: string (optional)  | Retrieves the contents of the text file (at key if specified)  |
| put  | any  | Replaces contents of the file with JSON representation of payload (if possible) and returns new data  |

# Tests

