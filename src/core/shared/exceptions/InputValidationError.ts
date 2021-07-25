import { Allow, IsArray, IsOptional, IsString, ValidationError } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { MessageError } from './message/MessageError';

export class InputValidationFieldError {
    @IsString()
    name: string;

    @Allow()
    value: any;

    @IsString()
    message: string;

    @IsArray()
    @IsOptional()
    @JSONSchema({ type: 'array', $ref: '#/components/schemas/' + InputValidationFieldError.name })
    children: InputValidationFieldError[];

    constructor(error: ValidationError) {
        this.name = error.property;
        this.value = error.value;
        if (error.constraints && Object.keys(error.constraints).length)
            this.message = error.constraints[Object.keys(error.constraints)[0]];
        if (error.children && error.children.length)
            this.children = error.children.map(item => new InputValidationFieldError(item));
    }
}

export class InputValidationError extends Error {
    httpCode: number;

    @IsString()
    code: string;

    @IsString()
    override name: string;

    @IsString()
    override message: string;

    @IsArray()
    @IsOptional()
    @JSONSchema({ type: 'array', $ref: '#/components/schemas/' + InputValidationFieldError.name })
    fields: InputValidationFieldError[];

    constructor(errors: ValidationError[]) {
        super();
        this.httpCode = 400;
        this.name = 'InputValidationError';
        this.code = MessageError.INPUT_VALIDATION.code;
        this.message = MessageError.INPUT_VALIDATION.message;
        if (errors)
            this.fields = errors.map(item => new InputValidationFieldError(item));
    }
}
