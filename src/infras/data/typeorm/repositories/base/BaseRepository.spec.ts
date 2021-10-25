import 'mocha';
import { randomUUID } from 'crypto';
import { BaseEntity } from '@domain/entities/base/BaseEntity';
import { IEntity } from '@domain/interfaces/base/IEntity';
import { DbFilter } from '@shared/database/DbFilter';
import { DbPaginationFilter } from '@shared/database/DbPaginationFilter';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';
import { mockDeleteQueryBuilder, MockDeleteResult, mockInsertQueryBuilder, MockInsertResult, mockQueryRunner, mockRestoreQueryBuilder, mockSelectQueryBuilder, mockSoftDeleteQueryBuilder, mockUpdateQueryBuilder, MockUpdateResult } from '@shared/test/MockTypeORM';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import * as typeorm from 'typeorm';
import { BaseRepository } from './BaseRepository';
import { BaseDbEntity } from '../../entities/base/BaseDBEntity';
import { BASE_SCHEMA } from '../../schemas/base/BaseSchema';

interface IDataTest extends IEntity<string> {}

class DataTest extends BaseEntity<string, IDataTest> implements IDataTest {
    name: string;
}

const DATA_TEST_SCHEMA = {
    TABLE_NAME: 'data_test',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        NAME: 'name'
    }
};

@typeorm.Entity(DATA_TEST_SCHEMA.TABLE_NAME)
class DataTestDb extends BaseDbEntity<string, DataTest> implements IDataTest {
    toEntity(): DataTest {
        return new DataTest(this);
    }

    fromEntity(entity: DataTest): IDataTest {
        return entity.toData();
    }
}

interface IDataTestRepository extends IBaseRepository<string, DataTest> {}

class DataTestRepository extends BaseRepository<string, DataTest, DataTestDb> implements IDataTestRepository {}

describe('Base repository', () => {
    const sandbox = createSandbox();

    describe('Find and count data', () => {
        let dataTests: DataTestDb[];

        beforeEach(() => {
            dataTests = [
                new DataTestDb(),
                new DataTestDb()
            ];
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('Find and count data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.skip.returnsThis();
            selectQueryBuilder.take.returnsThis();
            selectQueryBuilder.getManyAndCount.resolves([dataTests, dataTests.length]);

            const filter = new DbPaginationFilter();
            filter.setPagination(0, 10);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const [list, count] = await dataTestRepository.findAndCount(filter);

            expect(list.length).to.eq(dataTests.length);
            expect(count).to.eq(dataTests.length);
        });

        it('Find and count data with pagination', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.skip.returnsThis();
            selectQueryBuilder.take.returnsThis();
            selectQueryBuilder.getManyAndCount.resolves([[dataTests[0]], dataTests.length]);

            const filter = new DbPaginationFilter();
            filter.setPagination(0, 1);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const [list, count] = await dataTestRepository.findAndCount(filter);

            expect(list.length).to.eq(1);
            expect(count).to.eq(dataTests.length);
        });

        it('Find and count without data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.skip.returnsThis();
            selectQueryBuilder.take.returnsThis();
            selectQueryBuilder.getManyAndCount.resolves([[], 0]);

            const filter = new DbPaginationFilter();
            filter.setPagination(10, 1);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const [list, count] = await dataTestRepository.findAndCount(filter);

            expect(list.length).to.eq(0);
            expect(count).to.eq(0);
        });
    });

    describe('Count data', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Count data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.getCount.resolves(1);

            const filter = new DbFilter();
            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const count = await dataTestRepository.count(filter);

            expect(count).to.eq(1);
        });

        it('Count data with transaction', async () => {
            const { queryRunner } = mockQueryRunner(sandbox);
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.getCount.resolves(1);

            const filter = new DbFilter();
            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const count = await dataTestRepository.count(filter, queryRunner);

            expect(count).to.eq(1);
        });
    });

    describe('Get data', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Get data', async () => {
            const data = new DataTestDb();
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.whereInIds.returnsThis();
            selectQueryBuilder.getOne.resolves(data);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.get(randomUUID());

            expect(result).to.not.eq(null);
        });

        it('Get without data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.whereInIds.returnsThis();
            selectQueryBuilder.getOne.resolves();

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.get(randomUUID());

            expect(result).to.eq(null);
        });

        it('Get data with transaction', async () => {
            const data = new DataTestDb();
            const { queryRunner } = mockQueryRunner(sandbox);
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.whereInIds.returnsThis();
            selectQueryBuilder.getOne.resolves(data);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.get(randomUUID(), queryRunner);

            expect(result).to.not.eq(null);
        });
    });

    describe('Create data', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Create data and return new id', async () => {
            const data = new DataTest({ id: randomUUID() } as IDataTest);
            const { insertQueryBuilder } = mockInsertQueryBuilder<DataTestDb>(sandbox);
            insertQueryBuilder.values.returnsThis();
            insertQueryBuilder.execute.resolves(new MockInsertResult(data.id));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const id = await dataTestRepository.create(data);

            expect(id).to.eq(data.id);
        });

        it('Create data with transaction and return new id', async () => {
            const data = new DataTest({ id: randomUUID() } as IDataTest);
            const { queryRunner } = mockQueryRunner(sandbox);
            const { insertQueryBuilder } = mockInsertQueryBuilder<DataTestDb>(sandbox);
            insertQueryBuilder.values.returnsThis();
            insertQueryBuilder.execute.resolves(new MockInsertResult(data.id));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const id = await dataTestRepository.create(data, queryRunner);

            expect(id).to.eq(data.id);
        });
    });

    describe('Create and get data', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Create and get data', async () => {
            const data = new DataTest({ id: randomUUID() } as IDataTest);
            const { selectQueryBuilder, insertQueryBuilder } = mockInsertQueryBuilder<DataTestDb>(sandbox);
            insertQueryBuilder.values.returnsThis();
            insertQueryBuilder.execute.resolves(new MockInsertResult(data.id));

            const data2 = new DataTestDb();
            data2.id = data.id;
            selectQueryBuilder.whereInIds.returnsThis();
            selectQueryBuilder.getOne.resolves(data2);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.createGet(data);

            expect(result).to.not.eq(null);
            expect(result && result.id).to.eq(data.id);
        });

        it('Create and get data with transaction', async () => {
            const data = new DataTest({ id: randomUUID() } as IDataTest);
            const { queryRunner } = mockQueryRunner(sandbox);
            const { selectQueryBuilder, insertQueryBuilder } = mockInsertQueryBuilder<DataTestDb>(sandbox);
            insertQueryBuilder.values.returnsThis();
            insertQueryBuilder.execute.resolves(new MockInsertResult(data.id));

            const data2 = new DataTestDb();
            data2.id = data.id;
            selectQueryBuilder.whereInIds.returnsThis();
            selectQueryBuilder.getOne.resolves(data2);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.createGet(data, queryRunner);

            expect(result).to.not.eq(null);
            expect(result && result.id).to.eq(data.id);
        });
    });

    describe('Create data multiple', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Create data multiple and return the list of new ids', async () => {
            const item1 = new DataTest({ id: randomUUID() } as IDataTest);
            const item2 = new DataTest({ id: randomUUID() } as IDataTest);
            const { insertQueryBuilder } = mockInsertQueryBuilder<DataTestDb>(sandbox);
            insertQueryBuilder.values.returnsThis();
            insertQueryBuilder.execute.resolves(new MockInsertResult(item1.id, item2.id));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.createMultiple([item1, item2]);

            expect(result[0]).to.eq(item1.id);
            expect(result[1]).to.eq(item2.id);
        });

        it('Create data multiple with transaction and return the list of new ids', async () => {
            const item1 = new DataTest({ id: randomUUID() } as IDataTest);
            const item2 = new DataTest({ id: randomUUID() } as IDataTest);
            const { queryRunner } = mockQueryRunner(sandbox);
            const { insertQueryBuilder } = mockInsertQueryBuilder<DataTestDb>(sandbox);
            insertQueryBuilder.values.returnsThis();
            insertQueryBuilder.execute.resolves(new MockInsertResult(item1.id, item2.id));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.createMultiple([item1, item2], queryRunner);

            expect(result[0]).to.eq(item1.id);
            expect(result[1]).to.eq(item2.id);
        });
    });

    describe('Update data', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Update data', async () => {
            const data = new DataTest();
            const { updateQueryBuilder } = mockUpdateQueryBuilder<DataTestDb>(sandbox);
            updateQueryBuilder.whereInIds.returnsThis();
            updateQueryBuilder.execute.resolves(new MockUpdateResult(1));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.update(randomUUID(), data);

            expect(hasSucceed).to.eq(true);
        });

        it('Update data with transaction', async () => {
            const data = new DataTest();
            const { queryRunner } = mockQueryRunner(sandbox);
            const { updateQueryBuilder } = mockUpdateQueryBuilder<DataTestDb>(sandbox);
            updateQueryBuilder.whereInIds.returnsThis();
            updateQueryBuilder.execute.resolves(new MockUpdateResult(1));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.update(randomUUID(), data, queryRunner);

            expect(hasSucceed).to.eq(true);
        });
    });

    describe('Update and get data', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Update and return data successful', async () => {
            const data = new DataTest({ id: randomUUID() } as IDataTest);
            const { selectQueryBuilder, updateQueryBuilder } = mockUpdateQueryBuilder<DataTestDb>(sandbox);
            updateQueryBuilder.whereInIds.returnsThis();
            updateQueryBuilder.execute.resolves(new MockUpdateResult(1));

            const data2 = new DataTestDb();
            data2.id = data.id;
            selectQueryBuilder.whereInIds.returnsThis();
            selectQueryBuilder.getOne.resolves(data2);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.updateGet(data.id, data);

            expect(result).to.not.eq(null);
            expect(result?.id).to.eq(data.id);
        });

        it('Update failed and return no data', async () => {
            const data = new DataTest({ id: randomUUID() } as IDataTest);
            const { updateQueryBuilder } = mockUpdateQueryBuilder<DataTestDb>(sandbox);
            updateQueryBuilder.whereInIds.returnsThis();
            updateQueryBuilder.execute.resolves(new MockUpdateResult());

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.updateGet(data.id, data);

            expect(result).to.eq(null);
        });

        it('Update with transaction and return data', async () => {
            const data = new DataTest({ id: randomUUID() } as IDataTest);
            const { queryRunner } = mockQueryRunner(sandbox);
            const { selectQueryBuilder, updateQueryBuilder } = mockUpdateQueryBuilder<DataTestDb>(sandbox);
            updateQueryBuilder.whereInIds.returnsThis();
            updateQueryBuilder.execute.resolves(new MockUpdateResult(1));

            const data2 = new DataTestDb();
            data2.id = data.id;
            selectQueryBuilder.whereInIds.returnsThis();
            selectQueryBuilder.getOne.resolves(data2);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.updateGet(data.id, data, queryRunner);

            expect(result).to.not.eq(null);
            expect(result?.id).to.eq(data.id);
        });
    });

    describe('Delete data', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Delete data', async () => {
            const { deleteQueryBuilder } = mockDeleteQueryBuilder<DataTestDb>(sandbox);
            deleteQueryBuilder.whereInIds.returnsThis();
            deleteQueryBuilder.execute.resolves(new MockDeleteResult(1));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.delete(randomUUID());

            expect(hasSucceed).to.eq(true);
        });

        it('Delete data with transaction', async () => {
            const { queryRunner } = mockQueryRunner(sandbox);
            const { deleteQueryBuilder } = mockDeleteQueryBuilder<DataTestDb>(sandbox);
            deleteQueryBuilder.whereInIds.returnsThis();
            deleteQueryBuilder.execute.resolves(new MockDeleteResult(1));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.delete(randomUUID(), queryRunner);

            expect(hasSucceed).to.eq(true);
        });
    });

    describe('Delete data multiple', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Delete data multiple', async () => {
            const { deleteQueryBuilder } = mockDeleteQueryBuilder<DataTestDb>(sandbox);
            deleteQueryBuilder.whereInIds.returnsThis();
            deleteQueryBuilder.execute.resolves(new MockDeleteResult(2));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.deleteMultiple([randomUUID(), randomUUID()]);

            expect(hasSucceed).to.eq(true);
        });

        it('Delete data multiple with transaction', async () => {
            const { queryRunner } = mockQueryRunner(sandbox);
            const { deleteQueryBuilder } = mockDeleteQueryBuilder<DataTestDb>(sandbox);
            deleteQueryBuilder.whereInIds.returnsThis();
            deleteQueryBuilder.execute.resolves(new MockDeleteResult(2));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.deleteMultiple([randomUUID(), randomUUID()], queryRunner);

            expect(hasSucceed).to.eq(true);
        });
    });

    describe('Soft delete', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Soft delete successful', async () => {
            const { softDeleteQueryBuilder } = mockSoftDeleteQueryBuilder<DataTestDb>(sandbox);
            softDeleteQueryBuilder.whereInIds.returnsThis();
            softDeleteQueryBuilder.execute.resolves(new MockUpdateResult(1));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.softDelete(randomUUID());

            expect(hasSucceed).to.eq(true);
        });

        it('Soft delete failed', async () => {
            const { softDeleteQueryBuilder } = mockSoftDeleteQueryBuilder<DataTestDb>(sandbox);
            softDeleteQueryBuilder.whereInIds.returnsThis();
            softDeleteQueryBuilder.execute.resolves(new MockUpdateResult());

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.softDelete(randomUUID());

            expect(hasSucceed).to.eq(false);
        });

        it('Soft delete with transaction', async () => {
            const { queryRunner } = mockQueryRunner(sandbox);
            const { softDeleteQueryBuilder } = mockSoftDeleteQueryBuilder<DataTestDb>(sandbox);
            softDeleteQueryBuilder.whereInIds.returnsThis();
            softDeleteQueryBuilder.execute.resolves(new MockUpdateResult(1));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.softDelete(randomUUID(), queryRunner);

            expect(hasSucceed).to.eq(true);
        });
    });

    describe('Soft delete multiple', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Soft delete multiple', async () => {
            const { softDeleteQueryBuilder } = mockSoftDeleteQueryBuilder<DataTestDb>(sandbox);
            softDeleteQueryBuilder.whereInIds.returnsThis();
            softDeleteQueryBuilder.execute.resolves(new MockUpdateResult(2));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.softDeleteMultiple([randomUUID(), randomUUID()]);

            expect(hasSucceed).to.eq(true);
        });

        it('Soft delete multiple with transaction', async () => {
            const { queryRunner } = mockQueryRunner(sandbox);
            const { softDeleteQueryBuilder } = mockSoftDeleteQueryBuilder<DataTestDb>(sandbox);
            softDeleteQueryBuilder.whereInIds.returnsThis();
            softDeleteQueryBuilder.execute.resolves(new MockUpdateResult(2));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.softDeleteMultiple([randomUUID(), randomUUID()], queryRunner);

            expect(hasSucceed).to.eq(true);
        });
    });

    describe('Restore data', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Restore data successful', async () => {
            const { restoreQueryBuilder } = mockRestoreQueryBuilder<DataTestDb>(sandbox);
            restoreQueryBuilder.whereInIds.returnsThis();
            restoreQueryBuilder.execute.resolves(new MockUpdateResult(1));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.restore(randomUUID());

            expect(hasSucceed).to.eq(true);
        });

        it('Restore data failed', async () => {
            const { restoreQueryBuilder } = mockRestoreQueryBuilder<DataTestDb>(sandbox);
            restoreQueryBuilder.whereInIds.returnsThis();
            restoreQueryBuilder.execute.resolves(new MockUpdateResult());

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.restore(randomUUID());

            expect(hasSucceed).to.eq(false);
        });

        it('Restore data with transaction', async () => {
            const { queryRunner } = mockQueryRunner(sandbox);
            const { restoreQueryBuilder } = mockRestoreQueryBuilder<DataTestDb>(sandbox);
            restoreQueryBuilder.whereInIds.returnsThis();
            restoreQueryBuilder.execute.resolves(new MockUpdateResult(1));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.restore(randomUUID(), queryRunner);

            expect(hasSucceed).to.eq(true);
        });
    });

    describe('Restore data multiple', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Restore data multiple', async () => {
            const { restoreQueryBuilder } = mockRestoreQueryBuilder<DataTestDb>(sandbox);
            restoreQueryBuilder.whereInIds.returnsThis();
            restoreQueryBuilder.execute.resolves(new MockUpdateResult(2));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.restoreMultiple([randomUUID(), randomUUID()]);

            expect(hasSucceed).to.eq(true);
        });

        it('Restore data multiple with transaction', async () => {
            const { queryRunner } = mockQueryRunner(sandbox);
            const { restoreQueryBuilder } = mockRestoreQueryBuilder<DataTestDb>(sandbox);
            restoreQueryBuilder.whereInIds.returnsThis();
            restoreQueryBuilder.execute.resolves(new MockUpdateResult(2));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.restoreMultiple([randomUUID(), randomUUID()], queryRunner);

            expect(hasSucceed).to.eq(true);
        });
    });
});
