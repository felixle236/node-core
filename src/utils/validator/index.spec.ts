import 'mocha';
import { InputValidationError } from '@shared/exceptions/InputValidationError';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { expect } from 'chai';
import { IsString } from 'class-validator';
import { isLiteralObject, validateDataInput } from '.';

class Test {
    @IsString()
    name: string;
}

describe('Utils - Validator', () => {
    describe('Validate data input', () => {
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

    describe('Check literal object', () => {
        it('Check literal object with value is object', async () => {
            const isObject = isLiteralObject({ test: 1 });
            expect(isObject).to.eq(true);
        });

        it('Check literal object with value is object instance', async () => {
            const isObject = isLiteralObject(new Test());
            expect(isObject).to.eq(true);
        });

        it('Check literal object failed with value is null', async () => {
            const isObject = isLiteralObject(null as any);
            expect(isObject).to.eq(false);
        });

        it('Check literal object failed with value is array', async () => {
            const isObject = isLiteralObject([{ test: 1 }]);
            expect(isObject).to.eq(false);
        });

        it('Check literal object failed with value is string', async () => {
            const isObject = isLiteralObject('test' as any);
            expect(isObject).to.eq(false);
        });

        it('Check literal object failed with value is number', async () => {
            const isObject = isLiteralObject(1 as any);
            expect(isObject).to.eq(false);
        });

        it('Check literal object failed with value is boolean', async () => {
            const isObject = isLiteralObject(true as any);
            expect(isObject).to.eq(false);
        });

        it('Check literal object failed with value is date', async () => {
            const isObject = isLiteralObject(new Date());
            expect(isObject).to.eq(false);
        });
    });
});
