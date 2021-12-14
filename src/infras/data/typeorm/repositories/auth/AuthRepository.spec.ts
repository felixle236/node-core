import 'mocha';
import { randomUUID } from 'crypto';
import { AuthType } from 'domain/enums/auth/AuthType';
import { RoleId } from 'domain/enums/user/RoleId';
import { expect } from 'chai';
import { IBackup, IMemoryDb } from 'pg-mem';
import { mockDb, mockDbContext } from 'shared/test/MockDbContext';
import { hashMD5 } from 'utils/Crypt';
import { AuthRepository } from './AuthRepository';
import { DbContext } from '../../DbContext';
import { AuthDb } from '../../entities/auth/AuthDb';
import { UserDb } from '../../entities/user/UserDb';

describe('Authorization repository', () => {
    let db: IMemoryDb;
    let dbContext: DbContext;
    let backup: IBackup;
    let authRepository: AuthRepository;
    const userId = randomUUID();
    const username = 'email.1@localhost.com';

    before(async () => {
        db = mockDb();
        dbContext = await mockDbContext(db);

        const userDbRepo = dbContext.getConnection().getRepository(UserDb);
        const authDbRepo = dbContext.getConnection().getRepository(AuthDb);
        authRepository = new AuthRepository();

        const user = new UserDb();
        user.id = userId;
        user.roleId = RoleId.Client;
        user.firstName = 'User';
        await userDbRepo.save(user);

        const auth = new AuthDb();
        auth.userId = userId;
        auth.type = AuthType.PersonalEmail;
        auth.username = username;
        auth.password = hashMD5('123456');
        await authDbRepo.save(auth);

        backup = db.backup();
    });

    afterEach(() => {
        backup.restore();
    });

    after(async () => {
        await dbContext.destroyConnection();
    });

    describe('Get all by user', () => {
        it('Get all by user', async () => {
            const list = await authRepository.getAllByUser(userId);
            expect(list.length).to.eq(1);
        });

        it('Get all by user without data', async () => {
            const list = await authRepository.getAllByUser(randomUUID());
            expect(list.length).to.eq(0);
        });
    });

    describe('Get by username', () => {
        it('Get by username', async () => {
            const result = await authRepository.getByUsername(username);
            expect(result?.username).to.eq(username);
        });

        it('Get by username without data', async () => {
            const result = await authRepository.getByUsername(randomUUID());
            expect(result).to.eq(undefined);
        });
    });
});
