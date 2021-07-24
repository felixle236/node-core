import { IsString } from 'class-validator';
import { MessageError } from './message/MessageError';

export class InternalServerError extends Error {
    httpCode: number;

    @IsString()
    code: string;

    @IsString()
    override name: string;

    @IsString()
    override message: string;

    constructor() {
        super();
        this.httpCode = 500;
        this.code = MessageError.SOMETHING_WRONG.code;
        this.name = 'InternalServerError';
        this.message = MessageError.SOMETHING_WRONG.message;
    }
}
