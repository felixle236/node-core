import 'mocha';
import { expect } from 'chai';
import { IsString } from 'shared/decorators/ValidationDecorator';
import { InputValidationError } from 'shared/exceptions/InputValidationError';
import { isLiteralObject, validateDataInput } from './Validation';

class Test {
  @IsString()
  name: string;
}

describe('Utils - Validation', () => {
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

  describe('Validate data input', () => {
    it('Validate data input with error', async () => {
      const test = new Test();
      test.name = 123 as any;
      let err = {} as InputValidationError;
      try {
        validateDataInput(test);
      } catch (error) {
        err = error as InputValidationError;
      }
      expect(err && err.fields && err.fields.length).to.eq(1);
    });

    it('Validate data input success', async () => {
      const test = new Test();
      test.name = '123';
      const isValid = validateDataInput(test);
      expect(isValid).to.eq(true);
    });
  });
});
