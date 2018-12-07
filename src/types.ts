import express from 'express';
import http from 'http';

import App_ from './App'
import SocketServer_ from './server/SocketServer'
import Socket_ from './server/socket'

declare global {

    type App = App_;
    type SocketServer = SocketServer_;
    type Socket = Socket_;

    type Express = express.Express;
    type RequestHandler = express.RequestHandler;
    type ExpressRequest = express.Request;
    type ExpressResponse = express.Response;
    type NextFunction = express.NextFunction;
    type HttpServer = http.Server;

}

export default {}