import 'mocha';
import { randomUUID } from 'crypto';
import { Entity } from 'domain/common/Entity';
import { expect } from 'chai';
import { IRepository } from 'shared/database/interfaces/IRepository';
import { mockDeleteQueryBuilder, MockDeleteResult, mockInsertQueryBuilder, MockInsertResult, mockQuerySession, mockRestoreQueryBuilder, mockSelectQueryBuilder, mockSoftDeleteQueryBuilder, mockUpdateQueryBuilder, MockUpdateResult } from 'shared/test/MockTypeORM';
import { createSandbox } from 'sinon';
import * as typeorm from 'typeorm';
import { Column } from 'typeorm';
import { DbEntity } from './DbEntity';
import { Repository } from './Repository';
import { SCHEMA } from './Schema';

class DataTest extends Entity {
    name: string;
}

const DATA_TEST_SCHEMA = {
    TABLE_NAME: 'data_test',
    COLUMNS: {
        ...SCHEMA.COLUMNS,
        NAME: 'name'
    }
};

typeorm.Entity(DATA_TEST_SCHEMA.TABLE_NAME);
class DataTestDb extends DbEntity<DataTest> {
    constructor() {
        super(DataTest);
    }

    @Column('varchar')
    name: string;

    override toEntity(): DataTest {
        const entity = super.toEntity();
        entity.name = this.name;
        return entity;
    }

    override fromEntity(entity: DataTest): void {
        super.fromEntity(entity);
        this.name = entity.name;
    }
}

interface IDataTestRepository extends IRepository<DataTest> {}

class DataTestRepository extends Repository<DataTest, DataTestDb> implements IDataTestRepository {}

describe('Base repository', () => {
    const sandbox = createSandbox();

    describe('Find all', () => {
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

        it('Find all data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.skip.returnsThis();
            selectQueryBuilder.take.returnsThis();
            selectQueryBuilder.getMany.resolves(dataTests);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const list = await dataTestRepository.findAll({});

            expect(list.length).to.eq(dataTests.length);
        });

        it('Find all without data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.skip.returnsThis();
            selectQueryBuilder.take.returnsThis();
            selectQueryBuilder.getMany.resolves([]);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const list = await dataTestRepository.findAll({});

            expect(list.length).to.eq(0);
        });

        it('Find all data with transaction', async () => {
            const { querySession } = mockQuerySession(sandbox);
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.skip.returnsThis();
            selectQueryBuilder.take.returnsThis();
            selectQueryBuilder.getMany.resolves(dataTests);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const list = await dataTestRepository.findAll({}, querySession);

            expect(list.length).to.eq(dataTests.length);
        });
    });

    describe('Find', () => {
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

        it('Find data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.skip.returnsThis();
            selectQueryBuilder.take.returnsThis();
            selectQueryBuilder.getMany.resolves(dataTests);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const list = await dataTestRepository.find({ skip: 0, limit: 10 });

            expect(list.length).to.eq(dataTests.length);
        });

        it('Find without data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.skip.returnsThis();
            selectQueryBuilder.take.returnsThis();
            selectQueryBuilder.getMany.resolves([]);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const list = await dataTestRepository.find({ skip: 0, limit: 10 });

            expect(list.length).to.eq(0);
        });

        it('Find data with transaction', async () => {
            const { querySession } = mockQuerySession(sandbox);
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.skip.returnsThis();
            selectQueryBuilder.take.returnsThis();
            selectQueryBuilder.getMany.resolves(dataTests);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const list = await dataTestRepository.find({ skip: 0, limit: 10 }, querySession);

            expect(list.length).to.eq(dataTests.length);
        });
    });

    describe('Find one', () => {
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

        it('Find one data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.skip.returnsThis();
            selectQueryBuilder.take.returnsThis();
            selectQueryBuilder.getOne.resolves(dataTests[0]);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.findOne({});

            expect(result).to.not.eq(undefined);
        });

        it('Find one without data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.skip.returnsThis();
            selectQueryBuilder.take.returnsThis();
            selectQueryBuilder.getOne.resolves(undefined);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.findOne({});

            expect(result).to.eq(undefined);
        });

        it('Find one data with transaction', async () => {
            const { querySession } = mockQuerySession(sandbox);
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.skip.returnsThis();
            selectQueryBuilder.take.returnsThis();
            selectQueryBuilder.getOne.resolves(dataTests[0]);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.findOne({}, querySession);

            expect(result).to.not.eq(undefined);
        });
    });

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

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const [list, count] = await dataTestRepository.findAndCount({ skip: 0, limit: 10 });

            expect(list.length).to.eq(dataTests.length);
            expect(count).to.eq(dataTests.length);
        });

        it('Find and count without data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.skip.returnsThis();
            selectQueryBuilder.take.returnsThis();
            selectQueryBuilder.getManyAndCount.resolves([[], 0]);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const [list, count] = await dataTestRepository.findAndCount({ skip: 0, limit: 10 });

            expect(list.length).to.eq(0);
            expect(count).to.eq(0);
        });

        it('Find and count data with transaction', async () => {
            const { querySession } = mockQuerySession(sandbox);
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.skip.returnsThis();
            selectQueryBuilder.take.returnsThis();
            selectQueryBuilder.getManyAndCount.resolves([[dataTests[0]], dataTests.length]);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const [list, count] = await dataTestRepository.findAndCount({ skip: 0, limit: 10 }, querySession);

            expect(list.length).to.eq(1);
            expect(count).to.eq(dataTests.length);
        });
    });

    describe('Count data', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Count data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.getCount.resolves(1);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const count = await dataTestRepository.count({});

            expect(count).to.eq(1);
        });

        it('Count data with transaction', async () => {
            const { querySession } = mockQuerySession(sandbox);
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.getCount.resolves(1);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const count = await dataTestRepository.count({}, querySession);

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

            expect(!!result).to.eq(true);
        });

        it('Get without data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.whereInIds.returnsThis();
            selectQueryBuilder.getOne.resolves();

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.get(randomUUID());

            expect(!result).to.eq(true);
        });

        it('Get data with transaction', async () => {
            const data = new DataTestDb();
            const { querySession } = mockQuerySession(sandbox);
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.whereInIds.returnsThis();
            selectQueryBuilder.getOne.resolves(data);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.get(randomUUID(), undefined, querySession);

            expect(!!result).to.eq(true);
        });
    });

    describe('Create data', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Create data and return new id', async () => {
            const data = new DataTest();
            data.id = randomUUID();
            const { insertQueryBuilder } = mockInsertQueryBuilder<DataTestDb>(sandbox);
            insertQueryBuilder.values.returnsThis();
            insertQueryBuilder.execute.resolves(new MockInsertResult(data.id));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const id = await dataTestRepository.create(data);

            expect(id).to.eq(data.id);
        });

        it('Create data with transaction and return new id', async () => {
            const data = new DataTest();
            data.id = randomUUID();
            const { querySession } = mockQuerySession(sandbox);
            const { insertQueryBuilder } = mockInsertQueryBuilder<DataTestDb>(sandbox);
            insertQueryBuilder.values.returnsThis();
            insertQueryBuilder.execute.resolves(new MockInsertResult(data.id));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const id = await dataTestRepository.create(data, querySession);

            expect(id).to.eq(data.id);
        });
    });

    describe('Create and get data', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Create and get data', async () => {
            const data = new DataTest();
            data.id = randomUUID();
            const { selectQueryBuilder, insertQueryBuilder } = mockInsertQueryBuilder<DataTestDb>(sandbox);
            insertQueryBuilder.values.returnsThis();
            insertQueryBuilder.execute.resolves(new MockInsertResult(data.id));

            const data2 = new DataTestDb();
            data2.id = data.id;
            selectQueryBuilder.whereInIds.returnsThis();
            selectQueryBuilder.getOne.resolves(data2);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.createGet(data);

            expect(!!result).to.eq(true);
            expect(result && result.id).to.eq(data.id);
        });

        it('Create and get data with transaction', async () => {
            const data = new DataTest();
            data.id = randomUUID();
            const { querySession } = mockQuerySession(sandbox);
            const { selectQueryBuilder, insertQueryBuilder } = mockInsertQueryBuilder<DataTestDb>(sandbox);
            insertQueryBuilder.values.returnsThis();
            insertQueryBuilder.execute.resolves(new MockInsertResult(data.id));

            const data2 = new DataTestDb();
            data2.id = data.id;
            selectQueryBuilder.whereInIds.returnsThis();
            selectQueryBuilder.getOne.resolves(data2);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.createGet(data, undefined, querySession);

            expect(!!result).to.eq(true);
            expect(result && result.id).to.eq(data.id);
        });
    });

    describe('Create data multiple', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Create data multiple and return the list of new ids', async () => {
            const item1 = new DataTest();
            item1.id = randomUUID();
            const item2 = new DataTest();
            item2.id = randomUUID();
            const { insertQueryBuilder } = mockInsertQueryBuilder<DataTestDb>(sandbox);
            insertQueryBuilder.values.returnsThis();
            insertQueryBuilder.execute.resolves(new MockInsertResult(item1.id, item2.id));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.createMultiple([item1, item2]);

            expect(result[0]).to.eq(item1.id);
            expect(result[1]).to.eq(item2.id);
        });

        it('Create data multiple with transaction and return the list of new ids', async () => {
            const item1 = new DataTest();
            item1.id = randomUUID();
            const item2 = new DataTest();
            item2.id = randomUUID();
            const { querySession } = mockQuerySession(sandbox);
            const { insertQueryBuilder } = mockInsertQueryBuilder<DataTestDb>(sandbox);
            insertQueryBuilder.values.returnsThis();
            insertQueryBuilder.execute.resolves(new MockInsertResult(item1.id, item2.id));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.createMultiple([item1, item2], querySession);

            expect(result[0]).to.eq(item1.id);
            expect(result[1]).to.eq(item2.id);
        });
    });

    describe('Create or update', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Create data', async () => {
            const data = new DataTest();
            data.id = randomUUID();
            mockUpdateQueryBuilder<DataTestDb>(sandbox);
            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            sandbox.stub(dataTestRepository, 'get').resolves(undefined);
            sandbox.stub(dataTestRepository, 'create').resolves(data.id);

            const id = await dataTestRepository.createOrUpdate(data);
            expect(id).to.eq(data.id);
        });

        it('Update data', async () => {
            const data = new DataTest();
            data.id = randomUUID();
            mockUpdateQueryBuilder<DataTestDb>(sandbox);
            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            sandbox.stub(dataTestRepository, 'get').resolves(data);
            sandbox.stub(dataTestRepository, 'update').resolves(true);

            const id = await dataTestRepository.createOrUpdate(data);
            expect(id).to.eq(data.id);
        });

        it('Create data with transaction', async () => {
            const data = new DataTest();
            data.id = randomUUID();
            mockUpdateQueryBuilder<DataTestDb>(sandbox);
            const { querySession } = mockQuerySession(sandbox);
            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            sandbox.stub(dataTestRepository, 'get').resolves(undefined);
            sandbox.stub(dataTestRepository, 'create').resolves(data.id);

            const id = await dataTestRepository.createOrUpdate(data, querySession);
            expect(id).to.eq(data.id);
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
            const { querySession } = mockQuerySession(sandbox);
            const { updateQueryBuilder } = mockUpdateQueryBuilder<DataTestDb>(sandbox);
            updateQueryBuilder.whereInIds.returnsThis();
            updateQueryBuilder.execute.resolves(new MockUpdateResult(1));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.update(randomUUID(), data, querySession);

            expect(hasSucceed).to.eq(true);
        });
    });

    describe('Update and get data', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Update and return data successful', async () => {
            const data = new DataTest();
            data.id = randomUUID();
            const { selectQueryBuilder, updateQueryBuilder } = mockUpdateQueryBuilder<DataTestDb>(sandbox);
            updateQueryBuilder.whereInIds.returnsThis();
            updateQueryBuilder.execute.resolves(new MockUpdateResult(1));

            const data2 = new DataTestDb();
            data2.id = data.id;
            selectQueryBuilder.whereInIds.returnsThis();
            selectQueryBuilder.getOne.resolves(data2);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.updateGet(data.id, data);

            expect(!!result).to.eq(true);
            expect(result?.id).to.eq(data.id);
        });

        it('Update failed and return no data', async () => {
            const data = new DataTest();
            data.id = randomUUID();
            const { updateQueryBuilder } = mockUpdateQueryBuilder<DataTestDb>(sandbox);
            updateQueryBuilder.whereInIds.returnsThis();
            updateQueryBuilder.execute.resolves(new MockUpdateResult());

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.updateGet(data.id, data);

            expect(!result).to.eq(true);
        });

        it('Update with transaction and return data', async () => {
            const data = new DataTest();
            data.id = randomUUID();
            const { querySession } = mockQuerySession(sandbox);
            const { selectQueryBuilder, updateQueryBuilder } = mockUpdateQueryBuilder<DataTestDb>(sandbox);
            updateQueryBuilder.whereInIds.returnsThis();
            updateQueryBuilder.execute.resolves(new MockUpdateResult(1));

            const data2 = new DataTestDb();
            data2.id = data.id;
            selectQueryBuilder.whereInIds.returnsThis();
            selectQueryBuilder.getOne.resolves(data2);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.updateGet(data.id, data, undefined, querySession);

            expect(!!result).to.eq(true);
            expect(result?.id).to.eq(data.id);
        });
    });

    describe('Update data fields', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Update data fields', async () => {
            const data = new DataTest();
            const { updateQueryBuilder } = mockUpdateQueryBuilder<DataTestDb>(sandbox);
            updateQueryBuilder.whereInIds.returnsThis();
            updateQueryBuilder.execute.resolves(new MockUpdateResult(1));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.updateFields(randomUUID(), data, ['name']);

            expect(hasSucceed).to.eq(true);
        });

        it('Update data fields with transaction', async () => {
            const data = new DataTest();
            const { querySession } = mockQuerySession(sandbox);
            const { updateQueryBuilder } = mockUpdateQueryBuilder<DataTestDb>(sandbox);
            updateQueryBuilder.whereInIds.returnsThis();
            updateQueryBuilder.execute.resolves(new MockUpdateResult(1));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.updateFields(randomUUID(), data, ['name'], querySession);

            expect(hasSucceed).to.eq(true);
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
            const { querySession } = mockQuerySession(sandbox);
            const { deleteQueryBuilder } = mockDeleteQueryBuilder<DataTestDb>(sandbox);
            deleteQueryBuilder.whereInIds.returnsThis();
            deleteQueryBuilder.execute.resolves(new MockDeleteResult(1));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.delete(randomUUID(), querySession);

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
            const { querySession } = mockQuerySession(sandbox);
            const { deleteQueryBuilder } = mockDeleteQueryBuilder<DataTestDb>(sandbox);
            deleteQueryBuilder.whereInIds.returnsThis();
            deleteQueryBuilder.execute.resolves(new MockDeleteResult(2));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.deleteMultiple([randomUUID(), randomUUID()], querySession);

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
            const { querySession } = mockQuerySession(sandbox);
            const { softDeleteQueryBuilder } = mockSoftDeleteQueryBuilder<DataTestDb>(sandbox);
            softDeleteQueryBuilder.whereInIds.returnsThis();
            softDeleteQueryBuilder.execute.resolves(new MockUpdateResult(1));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.softDelete(randomUUID(), querySession);

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
            const { querySession } = mockQuerySession(sandbox);
            const { softDeleteQueryBuilder } = mockSoftDeleteQueryBuilder<DataTestDb>(sandbox);
            softDeleteQueryBuilder.whereInIds.returnsThis();
            softDeleteQueryBuilder.execute.resolves(new MockUpdateResult(2));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.softDeleteMultiple([randomUUID(), randomUUID()], querySession);

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
            const { querySession } = mockQuerySession(sandbox);
            const { restoreQueryBuilder } = mockRestoreQueryBuilder<DataTestDb>(sandbox);
            restoreQueryBuilder.whereInIds.returnsThis();
            restoreQueryBuilder.execute.resolves(new MockUpdateResult(1));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.restore(randomUUID(), querySession);

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
            const { querySession } = mockQuerySession(sandbox);
            const { restoreQueryBuilder } = mockRestoreQueryBuilder<DataTestDb>(sandbox);
            restoreQueryBuilder.whereInIds.returnsThis();
            restoreQueryBuilder.execute.resolves(new MockUpdateResult(2));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const hasSucceed = await dataTestRepository.restoreMultiple([randomUUID(), randomUUID()], querySession);

            expect(hasSucceed).to.eq(true);
        });
    });
});
