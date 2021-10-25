import { BaseError } from './BaseError';
import { MessageError } from './message/MessageError';

export class InternalServerError extends BaseError {
    constructor() {
        super();
        this.httpCode = 500;
        this.code = MessageError.SOMETHING_WRONG.code;
        this.name = 'InternalServerError';
        this.message = JSON.stringify({ key: MessageError.SOMETHING_WRONG.message });
    }
}
