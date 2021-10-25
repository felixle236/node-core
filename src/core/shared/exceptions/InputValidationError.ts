import { RefSchemaArray } from '@shared/decorators/RefSchema';
import { IsArray, IsOptional, IsString } from '@shared/decorators/ValidationDecorator';
import { ValidationError } from 'class-validator';
import { BaseError } from './BaseError';
import { MessageError } from './message/MessageError';

export class InputValidationFieldError {
    @IsString()
    name: string;

    @IsString()
    message: string;
}

export class InputValidationError extends BaseError {
    @IsArray()
    @IsOptional()
    @RefSchemaArray(InputValidationFieldError)
    fields: InputValidationFieldError[];

    constructor(errors?: ValidationError[]) {
        super();
        this.httpCode = 400;
        this.name = 'InputValidationError';
        this.code = MessageError.INPUT_VALIDATION.code;
        this.message = JSON.stringify({ key: MessageError.INPUT_VALIDATION.message });
        this.fields = [];

        if (errors) {
            errors.forEach(error => {
                if (error.constraints) {
                    const constraints = error.constraints;
                    Object.keys(constraints).forEach(key => {
                        const field = new InputValidationFieldError();
                        field.name = error.property;
                        field.message = constraints[key];
                        this.fields.push(field);
                    });
                }
            });
        }
    }

    override translate(t: (phraseOrOptions: string | i18n.TranslateOptions, ...replace: string[]) => string): void {
        super.translate(t);

        this.fields.forEach(field => {
            const obj = JSON.parse(field.message);
            field.message = t('validation.' + obj.key, { field: obj.field, ...obj.params });
        });
    }
}
