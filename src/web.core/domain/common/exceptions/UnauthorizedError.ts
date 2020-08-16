import { MessageError } from './message/MessageError';

export class UnauthorizedError extends Error {
    code: string;
    httpCode: number;

    constructor() {
        super();
        this.httpCode = 401;
        this.code = MessageError.ACCESS_DENIED.code;
        this.message = MessageError.ACCESS_DENIED.message;
    }
}
