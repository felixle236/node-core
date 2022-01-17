import { BaseError } from './BaseError';
import { ErrorObject } from './message/ErrorObject';
import { MessageError } from './message/MessageError';

export class UnauthorizedError extends BaseError {
  constructor(errObj: ErrorObject = MessageError.UNAUTHORIZED, ...params: (string | number | boolean | { t: string })[]) {
    super();
    this.httpCode = 401;
    this.code = errObj.code;
    this.name = 'UnauthorizedError';
    this.message = JSON.stringify({ key: errObj.message, params });
  }
}
