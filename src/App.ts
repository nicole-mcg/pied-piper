import Route from './routes/Route'

import * as express from 'express';
import * as http from 'http';
import * as IO from 'socket.io';


export default class App {
    public express:any;
    public server:any;
    public io:any;

    constructor() {
        this.express = express();
        this.server = new http.Server(this.express);
        this.io = IO(this.server);
    }

    public createRoute(path:string, handlerFunc:Function) {
        this.express.get(path, handlerFunc);
    }

    public createRoutes(routes:Array<Route>) {
        routes.forEach((route) => {
            this.createRoute(route.path, route.handler);
        })
    }
}
