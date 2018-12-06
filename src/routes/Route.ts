
export default class Route {
    public path:string;
    public handler:Function;

    constructor(path:string, handler:Function) {
        this.path = path;
        this.handler = handler;
    }

}