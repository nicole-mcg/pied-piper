import '../types'

import App from '../App'

export default class Route {
    public path:string;
    public handler:RouteHandler;

    constructor(path:string, handler:RouteHandler) {
        this.path = path;
        this.handler = handler;
    }

}