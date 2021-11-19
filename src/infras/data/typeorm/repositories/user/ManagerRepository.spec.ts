import 'mocha';
import { ManagerStatus } from 'domain/enums/user/ManagerStatus';
import { RoleId } from 'domain/enums/user/RoleId';
import { expect } from 'chai';
import { mockSelectQueryBuilder, mockWhereExpressionBuilder } from 'shared/test/MockTypeORM';
import { createSandbox } from 'sinon';
import { Brackets } from 'typeorm';
import { ManagerRepository } from './ManagerRepository';
import { ManagerDb } from '../../entities/user/ManagerDb';

describe('Manager repository', () => {
    const sandbox = createSandbox();

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

            const managerRepository = new ManagerRepository();
            const [list, count] = await managerRepository.findAndCount({ skip: 0, limit: 10 });

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

            const managerRepository = new ManagerRepository();
            const [list, count] = await managerRepository.findAndCount({ skip: 0, limit: 10 });

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

            const managerRepository = new ManagerRepository();
            const [list, count] = await managerRepository.findAndCount({ roleIds: [RoleId.Manager, RoleId.Client], keyword: 'test', status: ManagerStatus.Actived, skip: 0, limit: 10 });

            const whereExpression = mockWhereExpressionBuilder();
            const brackets = selectQueryBuilder.andWhere.secondCall.args[0] as Brackets;
            brackets.whereFactory(whereExpression);

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

            expect(!!result).to.eq(true);
        });

        it('Get by email without data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<ManagerDb>(sandbox);
            selectQueryBuilder.where.returnsThis();
            selectQueryBuilder.getOne.resolves();

            const managerRepository = new ManagerRepository();
            const result = await managerRepository.getByEmail('test@localhost.com');

            expect(!result).to.eq(true);
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
