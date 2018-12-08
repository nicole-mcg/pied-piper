import { METHODS } from 'http';

export default class Endpoint {
    constructor() {
        METHODS.forEach((method) => {
            const funcName = method.toLowerCase();
            if (!this[funcName]) {
                this[funcName] = () => null;
            }
        });
    }
}
