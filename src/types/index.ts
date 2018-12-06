import * as express from 'express';
import * as http from 'http';

import App_ from '../App'
import SocketServer_ from '../server/SocketServer'
import Socket_ from '../server/socket'

declare global {

    type App = App_;

    interface Route {}
    type AppRequestHandler = (req:express.Request, res:express.Response, next:express.NextFunction, app:App) => any;

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