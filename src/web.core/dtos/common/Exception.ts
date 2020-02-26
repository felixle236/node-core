import { getMessageError } from '../../../constants/Messages';
import { mapTemplate } from '../../../libs/common';

export class SystemError extends Error {
    code: number;
    httpCode: number;

    constructor(code: number = 1, ...params) {
        super();
        this.code = code;
        this.httpCode = 400;

        let message = getMessageError(code);
        if (params && params.length)
            message = mapTemplate(message, ...params);

        this.code = code;
        this.message = message;
    }
}

export class UnauthorizedError extends SystemError {
    constructor(code: number, ...params) {
        super(code, ...params);
        this.httpCode = 401;
    }
}
