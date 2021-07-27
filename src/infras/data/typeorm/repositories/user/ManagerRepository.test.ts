import 'mocha';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { RoleId } from '@domain/enums/user/RoleId';
import { FindManagerFilter } from '@gateways/repositories/user/IManagerRepository';
import { mockSelectQueryBuilder } from '@shared/test/MockTypeORM';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { ManagerRepository } from './ManagerRepository';
import { ManagerDb } from '../../entities/user/ManagerDb';

describe('Manager repository', () => {
    const sandbox = createSandbox();

    it('Load entity defination', async () => {
        const data = new ManagerDb();
        const result = data.toEntity();
        expect(data.fromEntity(result)).to.not.eq(null);
    });

    describe('Find and count', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Find and count data', async () => {
            const managerDbs = [new ManagerDb(), new ManagerDb()];
            const { selectQueryBuilder } = mockSelectQueryBuilder<ManagerDb>(sandbox);
            selectQueryBuilder.where.returnsThis();
            selectQueryBuilder.andWhere.returnsThis();
            selectQueryBuilder.orWhere.returnsThis();
            selectQueryBuilder.skip.returnsThis();
            selectQueryBuilder.take.returnsThis();
            selectQueryBuilder.getManyAndCount.resolves([managerDbs, managerDbs.length]);

            const filter = new FindManagerFilter();
            filter.setPagination(0, 10);

            const managerRepository = new ManagerRepository();
            const [list, count] = await managerRepository.findAndCount(filter);

            expect(list.length).to.eq(managerDbs.length);
            expect(count).to.eq(managerDbs.length);
        });

        it('Find and count without data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<ManagerDb>(sandbox);
            selectQueryBuilder.where.returnsThis();
            selectQueryBuilder.andWhere.returnsThis();
            selectQueryBuilder.orWhere.returnsThis();
            selectQueryBuilder.skip.returnsThis();
            selectQueryBuilder.take.returnsThis();
            selectQueryBuilder.getManyAndCount.resolves([[], 0]);

            const filter = new FindManagerFilter();
            filter.setPagination(0, 10);

            const managerRepository = new ManagerRepository();
            const [list, count] = await managerRepository.findAndCount(filter);

            expect(list.length).to.eq(0);
            expect(count).to.eq(0);
        });

        it('Find and count data with params', async () => {
            const managerDbs = [new ManagerDb(), new ManagerDb()];
            const { selectQueryBuilder } = mockSelectQueryBuilder<ManagerDb>(sandbox);
            selectQueryBuilder.where.returnsThis();
            selectQueryBuilder.andWhere.returnsThis();
            selectQueryBuilder.orWhere.returnsThis();
            selectQueryBuilder.skip.returnsThis();
            selectQueryBuilder.take.returnsThis();
            selectQueryBuilder.getManyAndCount.resolves([managerDbs, managerDbs.length]);

            const filter = new FindManagerFilter();
            filter.setPagination(0, 10);
            filter.roleIds = [RoleId.MANAGER, RoleId.CLIENT];
            filter.keyword = 'test';
            filter.status = ManagerStatus.ACTIVED;

            const managerRepository = new ManagerRepository();
            const [list, count] = await managerRepository.findAndCount(filter);

            expect(list.length).to.eq(managerDbs.length);
            expect(count).to.eq(managerDbs.length);
        });
    });

    describe('Get by email', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Get by email', async () => {
            const data = new ManagerDb();
            const { selectQueryBuilder } = mockSelectQueryBuilder<ManagerDb>(sandbox);
            selectQueryBuilder.where.returnsThis();
            selectQueryBuilder.getOne.resolves(data);

            const managerRepository = new ManagerRepository();
            const result = await managerRepository.getByEmail('test@localhost.com');

            expect(result).to.not.eq(null);
        });

        it('Get by email without data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<ManagerDb>(sandbox);
            selectQueryBuilder.where.returnsThis();
            selectQueryBuilder.getOne.resolves();

            const managerRepository = new ManagerRepository();
            const result = await managerRepository.getByEmail('test@localhost.com');

            expect(result).to.eq(null);
        });
    });

    describe('Check email exist', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Check email exist', async () => {
            const data = new ManagerDb();
            const { selectQueryBuilder } = mockSelectQueryBuilder<ManagerDb>(sandbox);
            selectQueryBuilder.select.returnsThis();
            selectQueryBuilder.where.returnsThis();
            selectQueryBuilder.getOne.resolves(data);

            const managerRepository = new ManagerRepository();
            const hasSucceed = await managerRepository.checkEmailExist('test@localhost.com');

            expect(hasSucceed).to.eq(true);
        });

        it('Check email not exist', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<ManagerDb>(sandbox);
            selectQueryBuilder.select.returnsThis();
            selectQueryBuilder.where.returnsThis();
            selectQueryBuilder.getOne.resolves();

            const managerRepository = new ManagerRepository();
            const hasSucceed = await managerRepository.checkEmailExist('test@localhost.com');

            expect(hasSucceed).to.eq(false);
        });
    });
});
