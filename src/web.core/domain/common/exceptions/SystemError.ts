import { ErrorObject } from './message/ErrorObject';
import { mapTemplate } from '../../../../libs/common';

export class SystemError extends Error {
    code: string;
    httpCode: number;

    constructor(errObj: ErrorObject, ...params) {
        super();
        this.httpCode = 400;
        this.code = errObj.code;
        this.message = params && params.length ? mapTemplate(errObj.message, ...params) : errObj.message;
    }
}
