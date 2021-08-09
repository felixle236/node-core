/* eslint-disable @typescript-eslint/ban-types */
import { InputValidationError } from '@shared/exceptions/InputValidationError';
import { validate } from 'class-validator';

/**
 * Validate data input
 */
export async function validateDataInput(data: object): Promise<void> {
    const errors = await validate(data, { whitelist: true, validationError: { target: false } });
    if (errors && errors.length)
        throw new InputValidationError(errors);
}
