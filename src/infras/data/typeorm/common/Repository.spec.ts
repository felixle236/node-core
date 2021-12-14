import 'mocha';
import { randomUUID } from 'crypto';
import { Entity } from 'domain/common/Entity';
import { expect } from 'chai';
import { IBackup, IMemoryDb } from 'pg-mem';
import { SortType } from 'shared/database/DbTypes';
import { IRepository } from 'shared/database/interfaces/IRepository';
import { mockDb, mockDbContext } from 'shared/test/MockDbContext';
import * as typeorm from 'typeorm';
import { Column } from 'typeorm';
import { DbEntity } from './DbEntity';
import { Repository } from './Repository';
import { SCHEMA } from './Schema';
import { DbContext } from '../DbContext';

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

@typeorm.Entity(DATA_TEST_SCHEMA.TABLE_NAME)
class DataTestDb extends DbEntity<DataTest> {
    constructor() {
        super(DataTest);
    }

    @Column('varchar', { name: DATA_TEST_SCHEMA.COLUMNS.NAME })
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

class DataTestRepository extends Repository<DataTest, DataTestDb> implements IDataTestRepository {
    constructor() {
        super(DataTestDb, DATA_TEST_SCHEMA);
    }
}

describe('Base repository', () => {
    let db: IMemoryDb;
    let dbContext: DbContext;
    let backup: IBackup;
    let dataTestRepository: DataTestRepository;
    const id = randomUUID();
    const id2 = randomUUID();

    before(async () => {
        db = mockDb();
        dbContext = await mockDbContext(db, [DataTestDb]);

        const dataTestDbRepo = dbContext.getConnection().getRepository(DataTestDb);
        dataTestRepository = new DataTestRepository();

        let data = new DataTestDb();
        data.id = id;
        data.name = 'Name 1';
        await dataTestDbRepo.save(data);

        data = new DataTestDb();
        data.id = id2;
        data.name = 'Name 2';
        await dataTestDbRepo.save(data);

        backup = db.backup();
    });

    afterEach(() => {
        backup.restore();
    });

    after(async () => {
        await dbContext.destroyConnection();
    });

    describe('Find all', () => {
        it('Find all data', async () => {
            const list = await dataTestRepository.findAll({});
            expect(list.length).to.eq(2);
        });

        it('Find all without data', async () => {
            await dataTestRepository.deleteMultiple([id, id2]);
            const list = await dataTestRepository.findAll({});
            expect(list.length).to.eq(0);
        });

        it('Find all with sort', async () => {
            const list = await dataTestRepository.findAll({ sorts: [{ field: 'createdAt', type: SortType.Desc }, { field: 'updatedAt', type: SortType.Desc }] });
            expect(list.length).to.eq(2);
        });
    });

    describe('Find', () => {
        it('Find data', async () => {
            const list = await dataTestRepository.find({ skip: 0, limit: 10 });
            expect(list.length).to.eq(2);
        });

        it('Find without data', async () => {
            await dataTestRepository.deleteMultiple([id, id2]);
            const list = await dataTestRepository.find({ skip: 0, limit: 10 });
            expect(list.length).to.eq(0);
        });

        it('Find data with sort', async () => {
            const list = await dataTestRepository.find({ skip: 0, limit: 10, sorts: [{ field: 'createdAt', type: SortType.Desc }, { field: 'updatedAt', type: SortType.Desc }] });
            expect(list.length).to.eq(2);
        });
    });

    describe('Find one', () => {
        it('Find one data', async () => {
            const result = await dataTestRepository.findOne({});
            expect(result).to.not.eq(undefined);
        });

        it('Find one without data', async () => {
            await dataTestRepository.deleteMultiple([id, id2]);
            const result = await dataTestRepository.findOne({});
            expect(result).to.eq(undefined);
        });
    });

    describe('Find and count data', () => {
        it('Find and count data', async () => {
            const [list, count] = await dataTestRepository.findAndCount({ skip: 0, limit: 10 });

            expect(list.length).to.eq(2);
            expect(count).to.eq(2);
        });

        it('Find and count without data', async () => {
            await dataTestRepository.deleteMultiple([id, id2]);
            const [list, count] = await dataTestRepository.findAndCount({ skip: 0, limit: 10 });

            expect(list.length).to.eq(0);
            expect(count).to.eq(0);
        });

        it('Find and count data with sort', async () => {
            const [list, count] = await dataTestRepository.findAndCount({ skip: 0, limit: 10, sorts: [{ field: 'createdAt', type: SortType.Desc }, { field: 'updatedAt', type: SortType.Desc }] });

            expect(list.length).to.eq(2);
            expect(count).to.eq(2);
        });
    });

    describe('Count data', () => {
        it('Count data', async () => {
            const count = await dataTestRepository.count({});
            expect(count).to.eq(2);
        });
    });

    describe('Get data', () => {
        it('Get data', async () => {
            const result = await dataTestRepository.get(id);
            expect(result).to.not.eq(undefined);
        });

        it('Get without data', async () => {
            const result = await dataTestRepository.get(randomUUID());
            expect(result).to.eq(undefined);
        });
    });

    describe('Create data', () => {
        it('Create data and return new id', async () => {
            const data = new DataTest();
            data.id = randomUUID();
            data.name = 'Test';
            const id = await dataTestRepository.create(data);

            expect(id).to.eq(data.id);
        });
    });

    describe('Create and get data', () => {
        it('Create and get data', async () => {
            const data = new DataTest();
            data.id = randomUUID();
            data.name = 'Test';
            const result = await dataTestRepository.createGet(data);

            expect(result?.id).to.eq(data.id);
            expect(result?.name).to.eq(data.name);
        });
    });

    describe('Create data multiple', () => {
        it('Create data multiple and return the list of new ids', async () => {
            const data = new DataTest();
            data.id = randomUUID();
            data.name = 'Test';

            const data2 = new DataTest();
            data2.id = randomUUID();
            data2.name = 'Test 2';

            const result = await dataTestRepository.createMultiple([data, data2]);

            expect(result[0]).to.eq(data.id);
            expect(result[1]).to.eq(data2.id);
        });
    });

    describe('Update data', () => {
        it('Update data', async () => {
            const data = new DataTest();
            data.id = id;
            data.name = 'Test 1';

            const hasSucceed = await dataTestRepository.update(id, data);
            expect(hasSucceed).to.eq(true);
        });
    });

    describe('Update and get data', () => {
        afterEach(() => {
            backup.restore();
        });

        it('Update and return data successful', async () => {
            const data = new DataTest();
            data.id = id;
            data.name = 'Test 1';

            const result = await dataTestRepository.updateGet(data.id, data);

            expect(result?.id).to.eq(data.id);
            expect(result?.name).to.eq(data.name);
        });

        it('Update failed and return no data', async () => {
            const data = new DataTest();
            data.id = randomUUID();
            data.name = 'Test 1';

            const result = await dataTestRepository.updateGet(data.id, data);
            expect(result).to.eq(undefined);
        });
    });

    describe('Update data fields', () => {
        it('Update data fields', async () => {
            const data = new DataTest();
            data.id = id;
            data.name = 'Test 1';

            const hasSucceed = await dataTestRepository.updateFields(data.id, data, ['name']);
            expect(hasSucceed).to.eq(true);
        });
    });

    describe('Delete data', () => {
        it('Delete data', async () => {
            const hasSucceed = await dataTestRepository.delete(id);
            expect(hasSucceed).to.eq(true);
        });
    });

    describe('Delete data multiple', () => {
        it('Delete data multiple', async () => {
            const hasSucceed = await dataTestRepository.deleteMultiple([id, id2]);
            expect(hasSucceed).to.eq(true);
        });
    });

    describe('Soft delete', () => {
        afterEach(() => {
            backup.restore();
        });

        it('Soft delete successful', async () => {
            const hasSucceed = await dataTestRepository.softDelete(id);
            expect(hasSucceed).to.eq(true);
        });

        it('Soft delete failed', async () => {
            const hasSucceed = await dataTestRepository.softDelete(randomUUID());
            expect(hasSucceed).to.eq(false);
        });
    });

    describe('Soft delete multiple', () => {
        it('Soft delete multiple', async () => {
            const hasSucceed = await dataTestRepository.softDeleteMultiple([id, id2]);
            expect(hasSucceed).to.eq(true);
        });
    });

    describe('Restore data', () => {
        afterEach(() => {
            backup.restore();
        });

        it('Restore data successful', async () => {
            await dataTestRepository.softDelete(id);
            const hasSucceed = await dataTestRepository.restore(id);
            expect(hasSucceed).to.eq(true);
        });

        it('Restore data failed', async () => {
            await dataTestRepository.softDelete(id);
            const hasSucceed = await dataTestRepository.restore(randomUUID());
            expect(hasSucceed).to.eq(false);
        });
    });

    describe('Restore data multiple', () => {
        it('Restore data multiple', async () => {
            await dataTestRepository.softDeleteMultiple([id, id2]);
            const hasSucceed = await dataTestRepository.restoreMultiple([id, id2]);
            expect(hasSucceed).to.eq(true);
        });
    });
});
