import * as express from 'express';
import * as http from 'http';

import * as Application from '../App'

declare global {

    type App = Application.default;

    interface Route {}
    type AppRequestHandler = (req:express.Request, res:express.Response, next:express.NextFunction, app:App) => any;

    type Express = express.Express;
    type RequestHandler = express.RequestHandler;
    type ExpressRequest = express.Request;
    type ExpressResponse = express.Response;
    type NextFunction = express.NextFunction;

    type HttpServer = http.Server;
}

export default {}