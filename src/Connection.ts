
import App from '@app/App';
import SocketConnection from '@app/socket/SocketConnection';

export default abstract class Connection {
    protected app: App;

    constructor(app) {
        this.app = app;
    }

    public abstract onSuccess(payload: string);
    public abstract onError(message: string);

    public onRequest(endpoint: string, payload: string, method: string) {
        this.app.onRequest(endpoint, payload, this as unknown as SocketConnection, method);
    }
}
