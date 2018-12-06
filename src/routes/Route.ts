import '../types'

import App from '../App'

export default class Route {
    public path:string;
    public handler:RequestHandler;

    constructor(path:string, handler:RequestHandler) {
        this.path = path;
        this.handler = handler;
    }

}