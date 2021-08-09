import 'mocha';
import { InputValidationError } from '@shared/exceptions/InputValidationError';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { expect } from 'chai';
import { IsString } from 'class-validator';
import { validateDataInput } from '.';

class Test {
    @IsString()
    name: string;
}

describe('Utils - Validator', () => {
    it('Validate data input with error', async () => {
        const test = new Test();

        const error: InputValidationError = await validateDataInput(test).catch(error => error);
        expect(error.code).to.eq(MessageError.INPUT_VALIDATION.code);
        expect(error.message).to.eq(MessageError.INPUT_VALIDATION.message);
        expect(error.fields[0].name).to.eq('name');
    });

    it('Validate data input', async () => {
        const test = new Test();
        test.name = 'Node Core';

        await validateDataInput(test);
        expect(true).to.eq(true);
    });
});
