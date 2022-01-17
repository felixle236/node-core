import 'mocha';
import { expect } from 'chai';
import { IMemoryDb } from 'pg-mem';
import { mockDb, mockDbContext } from 'shared/test/MockDbContext';
import { UserRepository } from './UserRepository';
import { DbContext } from '../../DbContext';
import { UserDb } from '../../entities/user/UserDb';

describe('User repository', () => {
  let db: IMemoryDb;
  let dbContext: DbContext;

  before(async () => {
    db = mockDb();
    dbContext = await mockDbContext(db);
  });

  after(async () => {
    await dbContext.destroyConnection();
  });

  it('Initialize repository', async () => {
    dbContext.getConnection().getRepository(UserDb);
    const userRepository = new UserRepository();

    expect(!!userRepository).to.eq(true);
  });
});
