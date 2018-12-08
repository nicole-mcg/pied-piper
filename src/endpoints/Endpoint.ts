import App from '@app/App';

export default class Endpoint {
    constructor() {
        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach((method) => {
            const funcName = method.toLowerCase();
            if (!this[funcName]) {
                this[funcName] = () => null;
            }
        });
    }
}
