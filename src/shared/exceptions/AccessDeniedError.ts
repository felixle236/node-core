import { BaseError } from './BaseError';
import { MessageError } from './message/MessageError';

export class AccessDeniedError extends BaseError {
  constructor() {
    super();
    this.httpCode = 403;
    this.code = MessageError.ACCESS_DENIED.code;
    this.name = 'AccessDeniedError';
    this.message = JSON.stringify({ key: MessageError.ACCESS_DENIED.message });
  }
}
