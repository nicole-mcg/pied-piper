
import App from './App';
import Socket from './socket/Socket';

export default abstract class Client {
    protected app: App;

    constructor(app) {
        this.app = app;
    }

    public abstract onSuccess(payload: string);
    public abstract onError(message: string);

    public onRequest(endpoint: string, payload: string, method: string) {
        this.app.handleEndpoint(endpoint, payload, this as unknown as Socket, method);
    }
}
