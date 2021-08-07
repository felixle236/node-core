import { IValueObject } from '@domain/interfaces/base/IValueObject';
import { expect } from 'chai';
import { BaseVO } from './BaseVO';

interface ITestVO extends IValueObject {
    name: string;
}

class TestVO extends BaseVO<ITestVO> implements ITestVO {
    get name(): string {
        return this.data.name;
    }

    set name(value: string) {
        this.data.name = value;
    }
}

describe('Base value object', () => {
    it('Get data from base value object', async () => {
        const testVO = new TestVO({ name: 'test' });
        const data = testVO.toData();

        expect(data.name).to.eq(testVO.name);
    });

    it('Get new data from base value object', async () => {
        const testVO = new TestVO();
        testVO.name = 'test';
        const data = testVO.toData();

        expect(data.name).to.eq(testVO.name);
    });
});
