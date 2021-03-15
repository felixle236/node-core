import { MessageError } from './message/MessageError';

export class InternalServerError extends Error {
    code: string;
    httpCode: number;

    constructor() {
        super();
        this.httpCode = 500;
        this.code = MessageError.SOMETHING_WRONG.code;
        this.message = MessageError.SOMETHING_WRONG.message;
    }
}
