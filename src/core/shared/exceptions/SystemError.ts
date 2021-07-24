import { mapTemplate } from '@libs/common';
import { IsString } from 'class-validator';
import { ErrorObject } from './message/ErrorObject';

export class SystemError extends Error {
    httpCode: number;

    @IsString()
    code: string;

    @IsString()
    override name: string;

    @IsString()
    override message: string;

    constructor(errObj: ErrorObject, ...params: any[]) {
        super();
        this.httpCode = 400;
        this.code = errObj.code;
        this.name = 'SystemError';
        this.message = params && params.length ? mapTemplate(errObj.message, ...params) : errObj.message;
    }
}
