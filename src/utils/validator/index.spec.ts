import 'mocha';
import { IsString } from '@shared/decorators/ValidationDecorator';
import { expect } from 'chai';
import { isLiteralObject } from '.';

class Test {
    @IsString()
    name: string;
}

describe('Utils - Validator', () => {
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
