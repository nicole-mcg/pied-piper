import Route from './routes/Route'

import * as express from 'express';
import * as http from 'http';
import * as IO from 'socket.io';

export default class App {
    public express:any;
    public httpServer:any;
    public io:any;

    public readonly routes:{ [s: string]: Function; };

    constructor() {
        this.express = express();
        this.httpServer = new http.Server(this.express);
        this.io = IO(this.httpServer);

        this.routes = {};
    }

    public createRoute(path:string, handlerFunc:(req:any, res:any, app:App) => any) {
        const wrappedHandler:Function = (req:any, res:any) => handlerFunc(req, res, this);
        this.routes[path] = wrappedHandler;
        this.express.get(path, wrappedHandler);
    }

    public createRoutes(routes:Array<Route>) {
        routes.forEach((route) => {
            this.createRoute(route.path, route.handler);
        })
    }
}
