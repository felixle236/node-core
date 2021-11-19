import { BaseError } from './BaseError';
import { ErrorObject } from './message/ErrorObject';
import { MessageError } from './message/MessageError';

export class NotFoundError extends BaseError {
    constructor(errObj: ErrorObject = MessageError.DATA_NOT_FOUND, ...params: (string | number | boolean | { t: string })[]) {
        super();
        this.httpCode = 404;
        this.code = errObj.code;
        this.name = 'NotFoundError';
        this.message = JSON.stringify({ key: errObj.message, params });
    }
}
