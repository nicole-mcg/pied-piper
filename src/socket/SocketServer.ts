import http from 'http';
import IO from 'socket.io';

import autoBind from 'auto-bind';

import Socket from './Socket'
import Endpoint from '../endpoints/Endpoint';
import Client from '../Client';

export default class SocketServer {
    public io:any;
    public endpoints:{ [s: string]: Endpoint };

    constructor(httpServer:http.Server, endpoints:{ [s: string]: Endpoint }={}) {
        autoBind(this);
        this.endpoints = endpoints;
        this.io = IO(httpServer);

        this.io.on('connection', this.onConnectionRecieved);
    }

    onConnectionRecieved(ioSocket:any) : Socket {
        const socket:Socket = new Socket(ioSocket, this);
        console.log("Connection recieved: " + socket.id);
        return socket;
    }

    handleEndpoint(endpointName:string, payload:string, client:Client, method:string) {
        if (payload && !this.validatePayload(payload)) {
            client.onError("Invalid request data");
            return;
        }

        const endpoint:Endpoint = this.endpoints[endpointName];
        if (!endpoint) {
            return;
        }  

        const funcName = method.toLowerCase();
        endpoint[funcName](payload, client, this);
    }

    private validatePayload(payload:string):boolean {
        try {
            JSON.parse(payload);
            return true;
        } catch(e) {
            return false;
        }
    }

}