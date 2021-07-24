import { IsString } from 'class-validator';
import { MessageError } from './message/MessageError';

export class AccessDeniedError extends Error {
    httpCode: number;

    @IsString()
    code: string;

    @IsString()
    override name: string;

    @IsString()
    override message: string;

    constructor() {
        super();
        this.httpCode = 403;
        this.code = MessageError.ACCESS_DENIED.code;
        this.name = 'AccessDeniedError';
        this.message = MessageError.ACCESS_DENIED.message;
    }
}
