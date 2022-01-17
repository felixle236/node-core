import { ValidationError } from 'class-validator';
import { TranslateOptions } from 'i18n';
import { RefSchemaArray } from 'shared/decorators/RefSchema';
import { IsOptional, IsPositive, IsArray, IsString } from 'shared/decorators/ValidationDecorator';
import { BaseError } from './BaseError';
import { MessageError } from './message/MessageError';

export class InputValidationFieldError {
  @IsPositive()
  @IsOptional()
  index: number;

  @IsString()
  name: string;

  @IsString()
  message: string;
}

export class InputValidationError extends BaseError {
  @IsArray()
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
      this._getErrorDetail(errors);
    }
  }

  private _getErrorDetail(errors: ValidationError[], index?: string): void {
    errors.forEach((error) => {
      if (error.constraints) {
        const constraints = error.constraints;
        Object.keys(constraints).forEach((key) => {
          const field = new InputValidationFieldError();
          if (index) {
            field.index = parseInt(index);
          }
          field.name = error.property;
          field.message = constraints[key];
          this.fields.push(field);
        });
      }
      if (error.children) {
        this._getErrorDetail(error.children, error.property);
      }
    });
  }

  override translate(t: (phraseOrOptions: string | TranslateOptions, ...replace: string[]) => string): void {
    super.translate(t);

    this.fields.forEach((field) => {
      const obj = JSON.parse(field.message);
      field.message = t('validation.' + obj.key, { field: obj.field, ...obj.params });
    });
  }
}
