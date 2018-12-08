import { METHODS } from 'http';
import Client from '../Client';
import SocketServer from '../socket/SocketServer';

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
