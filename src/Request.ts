
import App from './App';
import SocketRequest from './socket/SocketRequest';

export default abstract class Request {
    protected app: App;

    constructor(app) {
        this.app = app;
    }

    public abstract onSuccess(payload: string);
    public abstract onError(message: string);

    public onRequest(endpoint: string, payload: string, method: string) {
        this.app.onRequest(endpoint, payload, this as unknown as SocketRequest, method);
    }
}
