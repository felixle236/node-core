import 'mocha';
import { BaseEntity } from '@domain/entities/base/BaseEntity';
import { IEntity } from '@domain/interfaces/base/IEntity';
import { DbFilter } from '@shared/database/DbFilter';
import { DbPaginationFilter } from '@shared/database/DbPaginationFilter';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';
import { mockInsertQueryBuilder, MockInsertResult, mockQueryRunner, mockSelectQueryBuilder } from '@shared/test/MockTypeORM';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import * as typeorm from 'typeorm';
import { v4 } from 'uuid';
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
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.getCount.resolves(1);

            mockQueryRunner(sandbox);
            const connection = typeorm.getConnection();
            const queryRunner = connection.createQueryRunner();

            const filter = new DbFilter();
            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const count = await dataTestRepository.count(filter, queryRunner);

            expect(count).to.eq(1);
        });
    });

    describe('Get data by id', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Get data', async () => {
            const data = new DataTestDb();
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.whereInIds.returnsThis();
            selectQueryBuilder.getOne.resolves(data);

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.getById(v4());

            expect(result).to.not.eq(null);
        });

        it('Get without data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.whereInIds.returnsThis();
            selectQueryBuilder.getOne.resolves();

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.getById(v4());

            expect(result).to.eq(null);
        });

        it('Get data with transaction', async () => {
            const data = new DataTestDb();
            const { selectQueryBuilder } = mockSelectQueryBuilder<DataTestDb>(sandbox);
            selectQueryBuilder.whereInIds.returnsThis();
            selectQueryBuilder.getOne.resolves(data);

            mockQueryRunner(sandbox);
            const connection = typeorm.getConnection();
            const queryRunner = connection.createQueryRunner();

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.getById(v4(), queryRunner);

            expect(result).to.not.eq(null);
        });
    });

    describe('Create data', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Create data', async () => {
            const data = new DataTest({ id: v4() } as IDataTest);
            const { insertQueryBuilder } = mockInsertQueryBuilder<DataTestDb>(sandbox);
            insertQueryBuilder.values.returnsThis();
            insertQueryBuilder.execute.resolves(new MockInsertResult(data.id));

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const id = await dataTestRepository.create(data);

            expect(id).to.eq(data.id);
        });

        it('Create data with transaction', async () => {
            const data = new DataTest({ id: v4() } as IDataTest);
            const { insertQueryBuilder } = mockInsertQueryBuilder<DataTestDb>(sandbox);
            insertQueryBuilder.values.returnsThis();
            insertQueryBuilder.execute.resolves(new MockInsertResult(data.id));

            mockQueryRunner(sandbox);
            const connection = typeorm.getConnection();
            const queryRunner = connection.createQueryRunner();

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
            const data = new DataTest({ id: v4() } as IDataTest);
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
            const data = new DataTest({ id: v4() } as IDataTest);
            const { selectQueryBuilder, insertQueryBuilder } = mockInsertQueryBuilder<DataTestDb>(sandbox);
            insertQueryBuilder.values.returnsThis();
            insertQueryBuilder.execute.resolves(new MockInsertResult(data.id));

            const data2 = new DataTestDb();
            data2.id = data.id;
            selectQueryBuilder.whereInIds.returnsThis();
            selectQueryBuilder.getOne.resolves(data2);

            mockQueryRunner(sandbox);
            const connection = typeorm.getConnection();
            const queryRunner = connection.createQueryRunner();

            const dataTestRepository = new DataTestRepository(DataTestDb, DATA_TEST_SCHEMA);
            const result = await dataTestRepository.createGet(data, queryRunner);

            expect(result).to.not.eq(null);
            expect(result && result.id).to.eq(data.id);
        });
    });
});
