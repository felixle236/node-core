import { SystemError } from './SystemError';

export class UnauthorizedError extends SystemError {
    constructor(code: number, ...params) {
        super(code, ...params);
        this.httpCode = 401;
    }
}
