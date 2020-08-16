import { ErrorObject } from './message/ErrorObject';
import { MessageError } from './message/MessageError';
import { mapTemplate } from '../../../../libs/common';

export class UnauthorizedError extends Error {
    code: string;
    httpCode: number;

    constructor(errObj: ErrorObject = MessageError.ACCESS_DENIED, ...params) {
        super();
        this.httpCode = 401;
        this.code = errObj.code;
        this.message = params && params.length ? mapTemplate(errObj.message, ...params) : errObj.message;
    }
}
