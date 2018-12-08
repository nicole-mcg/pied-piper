import { REQUEST_METHODS } from '@app/Constants';

export default class Endpoint {
    constructor() {
        REQUEST_METHODS.forEach((method) => {
            const funcName = method.toLowerCase();
            if (!this[funcName]) {
                this[funcName] = () => null;
            }
        });
    }
}
