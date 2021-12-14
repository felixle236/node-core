import 'mocha';
import { expect } from 'chai';
import { convertObjectToString, convertStringToBoolean, convertToCurrency } from './Converter';

describe('Utils - Converter', () => {
    describe('Convert number to currency', () => {
        it('Convert number to currency without value', () => {
            const data = convertToCurrency(undefined);

            expect(data).to.eq('$0.00');
        });

        it('Convert number to currency', () => {
            const data = convertToCurrency(1000000);

            expect(data).to.eq('$1,000,000.00');
        });
    });

    describe('Convert string to boolean', () => {
        it('Convert string to boolean without value', () => {
            const isBoolean = convertStringToBoolean(undefined);

            expect(isBoolean).to.eq(false);
        });

        it('Convert string to boolean with invalid value', () => {
            const isBoolean = convertStringToBoolean('ok');

            expect(isBoolean).to.eq(false);
        });

        it('Convert string to boolean with value is "true"', () => {
            const isBoolean = convertStringToBoolean('true');

            expect(isBoolean).to.eq(true);
        });

        it('Convert string to boolean with value is "false"', () => {
            const isBoolean = convertStringToBoolean('false');

            expect(isBoolean).to.eq(false);
        });

        it('Convert string to boolean with value is "yes"', () => {
            const isBoolean = convertStringToBoolean('yes');

            expect(isBoolean).to.eq(true);
        });

        it('Convert string to boolean with value is "no"', () => {
            const isBoolean = convertStringToBoolean('no');

            expect(isBoolean).to.eq(false);
        });

        it('Convert string to boolean with value is "1"', () => {
            const isBoolean = convertStringToBoolean('1');

            expect(isBoolean).to.eq(true);
        });

        it('Convert string to boolean with value is "0"', () => {
            const isBoolean = convertStringToBoolean('0');

            expect(isBoolean).to.eq(false);
        });
    });

    describe('Convert object to string', () => {
        it('Convert object to string', () => {
            const content = convertObjectToString({ data: 'test' });

            expect(content).to.eq('{"data":"test"}');
        });

        it('Convert object to string with prettify', () => {
            const content = convertObjectToString({ data: 'test' }, true);

            expect(content).to.eq('{\n  "data": "test"\n}');
        });

        it('Convert object to string without value', () => {
            const content = convertObjectToString(undefined);

            expect(content).to.eq('');
        });
    });
});
