import 'mocha';
import { ManagerStatus } from 'domain/enums/user/ManagerStatus';
import { RoleId } from 'domain/enums/user/RoleId';
import { expect } from 'chai';
import { IBackup, IMemoryDb } from 'pg-mem';
import { SortType } from 'shared/database/DbTypes';
import { mockDb, mockDbContext } from 'shared/test/MockDbContext';
import { ManagerRepository } from './ManagerRepository';
import { DbContext } from '../../DbContext';
import { ManagerDb } from '../../entities/user/ManagerDb';

describe('Manager repository', () => {
  let db: IMemoryDb;
  let dbContext: DbContext;
  let backup: IBackup;
  let managerRepository: ManagerRepository;
  const email = 'manager.1@localhost.com';

  before(async () => {
    db = mockDb();
    dbContext = await mockDbContext(db);

    const managerDbRepo = dbContext.getConnection().getRepository(ManagerDb);
    managerRepository = new ManagerRepository();

    let manager = new ManagerDb();
    manager.roleId = RoleId.Manager;
    manager.firstName = 'Manager';
    manager.lastName = '1';
    manager.email = email;
    manager.status = ManagerStatus.Actived;
    await managerDbRepo.save(manager);

    manager = new ManagerDb();
    manager.roleId = RoleId.Manager;
    manager.firstName = 'Manager';
    manager.lastName = '2';
    manager.email = 'manager.2@localhost.com';
    manager.status = ManagerStatus.Actived;
    await managerDbRepo.save(manager);

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
      const [list, count] = await managerRepository.findAndCount({ skip: 0, limit: 10 });

      expect(list.length).to.eq(2);
      expect(count).to.eq(2);
    });

    it('Find and count without data', async () => {
      const [list, count] = await managerRepository.findAndCount({ keyword: 'no data', skip: 0, limit: 10 });

      expect(list.length).to.eq(0);
      expect(count).to.eq(0);
    });

    it('Find and count data with params', async () => {
      const [list, count] = await managerRepository.findAndCount({
        roleIds: [RoleId.Manager],
        keyword: 'manager 1',
        status: ManagerStatus.Actived,
        skip: 0,
        limit: 10,
      });

      expect(list.length).to.eq(1);
      expect(count).to.eq(1);
    });

    it('Find and count data with sort', async () => {
      const [list, count] = await managerRepository.findAndCount({
        roleIds: [RoleId.Manager],
        keyword: 'manager 1',
        status: ManagerStatus.Actived,
        sorts: [
          { field: 'createdAt', type: SortType.Desc },
          { field: 'firstName', type: SortType.Asc },
        ],
        skip: 0,
        limit: 10,
      });

      expect(list.length).to.eq(1);
      expect(count).to.eq(1);
    });
  });

  describe('Get by email', () => {
    it('Get by email', async () => {
      const result = await managerRepository.getByEmail(email);
      expect(result && result.email).to.eq(email);
    });

    it('Get by email without data', async () => {
      const result = await managerRepository.getByEmail('test@localhost.com');
      expect(result).to.eq(undefined);
    });
  });

  describe('Check email exist', () => {
    it('Check email exist', async () => {
      const isExist = await managerRepository.checkEmailExist(email);
      expect(isExist).to.eq(true);
    });

    it('Check email not exist', async () => {
      const isExist = await managerRepository.checkEmailExist('test@localhost.com');
      expect(isExist).to.eq(false);
    });
  });
});
