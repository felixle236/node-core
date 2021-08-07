import { IEntity } from '@domain/interfaces/base/IEntity';
import { expect } from 'chai';
import { v4 } from 'uuid';
import { BaseEntity } from './BaseEntity';

interface ITestEntity extends IEntity<string> {
    name: string;
}

class TestEntity extends BaseEntity<string, ITestEntity> implements ITestEntity {
    get name(): string {
        return this.data.name;
    }

    set name(value: string) {
        this.data.name = value;
    }
}

describe('Base entity', () => {
    it('Get data from base entity', async () => {
        const dataTest = {
            id: v4(),
            name: 'test',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: new Date()
        } as ITestEntity;
        const testEntity = new TestEntity(dataTest);
        const data = testEntity.toData();

        expect(data.id).to.eq(testEntity.id);
        expect(data.name).to.eq(testEntity.name);
        expect(data.createdAt.getTime()).to.eq(testEntity.createdAt.getTime());
        expect(data.updatedAt.getTime()).to.eq(testEntity.updatedAt.getTime());
        expect(data.deletedAt && data.deletedAt.getTime()).to.eq(testEntity.deletedAt && testEntity.deletedAt.getTime());
    });

    it('Get new data from base entity', async () => {
        const testEntity = new TestEntity();
        testEntity.name = 'test';
        const data = testEntity.toData();

        expect(data.name).to.eq(testEntity.name);
    });
});
