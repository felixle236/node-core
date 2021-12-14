import 'mocha';
import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { RoleId } from 'domain/enums/user/RoleId';
import { expect } from 'chai';
import { IBackup, IMemoryDb } from 'pg-mem';
import { SortType } from 'shared/database/DbTypes';
import { mockDb, mockDbContext } from 'shared/test/MockDbContext';
import { ClientRepository } from './ClientRepository';
import { DbContext } from '../../DbContext';
import { ClientDb } from '../../entities/user/ClientDb';

describe('Client repository', () => {
    let db: IMemoryDb;
    let dbContext: DbContext;
    let backup: IBackup;
    let clientRepository: ClientRepository;
    const email = 'client.1@localhost.com';

    before(async () => {
        db = mockDb();
        dbContext = await mockDbContext(db);

        const clientDbRepo = dbContext.getConnection().getRepository(ClientDb);
        clientRepository = new ClientRepository();

        let client = new ClientDb();
        client.roleId = RoleId.Client;
        client.firstName = 'Client';
        client.lastName = '1';
        client.email = email;
        client.status = ClientStatus.Actived;
        await clientDbRepo.save(client);

        client = new ClientDb();
        client.roleId = RoleId.Client;
        client.firstName = 'Client';
        client.lastName = '2';
        client.email = 'client.2@localhost.com';
        client.status = ClientStatus.Actived;
        await clientDbRepo.save(client);

        backup = db.backup();
    });

    afterEach(() => {
        backup.restore();
    });

    after(async () => {
        await dbContext.destroyConnection();
    });

    describe('Find and count', () => {
        it('Find and count data', async () => {
            const [list, count] = await clientRepository.findAndCount({ skip: 0, limit: 10 });

            expect(list.length).to.eq(2);
            expect(count).to.eq(2);
        });

        it('Find and count without data', async () => {
            const [list, count] = await clientRepository.findAndCount({ keyword: 'no data', skip: 0, limit: 10 });

            expect(list.length).to.eq(0);
            expect(count).to.eq(0);
        });

        it('Find and count data with params', async () => {
            const [list, count] = await clientRepository.findAndCount({ keyword: 'client 1', status: ClientStatus.Actived, skip: 0, limit: 10 });

            expect(list.length).to.eq(1);
            expect(count).to.eq(1);
        });

        it('Find and count data with sort', async () => {
            const [list, count] = await clientRepository.findAndCount({ keyword: 'client 1', status: ClientStatus.Actived, sorts: [{ field: 'createdAt', type: SortType.Desc }, { field: 'firstName', type: SortType.Asc }], skip: 0, limit: 10 });

            expect(list.length).to.eq(1);
            expect(count).to.eq(1);
        });
    });

    describe('Get by email', () => {
        it('Get by email', async () => {
            const result = await clientRepository.getByEmail(email);
            expect(result && result.email).to.eq(email);
        });

        it('Get by email without data', async () => {
            const result = await clientRepository.getByEmail('test@localhost.com');
            expect(result).to.eq(undefined);
        });
    });

    describe('Check email exist', () => {
        it('Check email exist', async () => {
            const isExist = await clientRepository.checkEmailExist(email);
            expect(isExist).to.eq(true);
        });

        it('Check email not exist', async () => {
            const isExist = await clientRepository.checkEmailExist('test@localhost.com');
            expect(isExist).to.eq(false);
        });
    });
});
