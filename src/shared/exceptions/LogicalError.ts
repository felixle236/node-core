import { BaseError } from './BaseError';
import { ErrorObject } from './message/ErrorObject';

export class LogicalError extends BaseError {
  constructor(errObj: ErrorObject, ...params: (string | number | boolean | { t: string })[]) {
    super();
    this.httpCode = 400;
    this.code = errObj.code;
    this.name = 'LogicalError';
    this.message = JSON.stringify({ key: errObj.message, params });
  }
}
