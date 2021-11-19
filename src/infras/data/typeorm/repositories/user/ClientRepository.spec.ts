import 'mocha';
import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { expect } from 'chai';
import { mockSelectQueryBuilder, mockWhereExpressionBuilder } from 'shared/test/MockTypeORM';
import { createSandbox } from 'sinon';
import { Brackets } from 'typeorm';
import { ClientRepository } from './ClientRepository';
import { ClientDb } from '../../entities/user/ClientDb';

describe('Client repository', () => {
    const sandbox = createSandbox();

    describe('Find and count', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Find and count data', async () => {
            const clientDbs = [new ClientDb(), new ClientDb()];
            const { selectQueryBuilder } = mockSelectQueryBuilder<ClientDb>(sandbox);
            selectQueryBuilder.where.returnsThis();
            selectQueryBuilder.andWhere.returnsThis();
            selectQueryBuilder.orWhere.returnsThis();
            selectQueryBuilder.skip.returnsThis();
            selectQueryBuilder.take.returnsThis();
            selectQueryBuilder.getManyAndCount.resolves([clientDbs, clientDbs.length]);

            const clientRepository = new ClientRepository();
            const [list, count] = await clientRepository.findAndCount({ skip: 0, limit: 10 });

            expect(list.length).to.eq(clientDbs.length);
            expect(count).to.eq(clientDbs.length);
        });

        it('Find and count without data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<ClientDb>(sandbox);
            selectQueryBuilder.where.returnsThis();
            selectQueryBuilder.andWhere.returnsThis();
            selectQueryBuilder.orWhere.returnsThis();
            selectQueryBuilder.skip.returnsThis();
            selectQueryBuilder.take.returnsThis();
            selectQueryBuilder.getManyAndCount.resolves([[], 0]);

            const clientRepository = new ClientRepository();
            const [list, count] = await clientRepository.findAndCount({ skip: 0, limit: 10 });

            expect(list.length).to.eq(0);
            expect(count).to.eq(0);
        });

        it('Find and count data with params', async () => {
            const clientDbs = [new ClientDb(), new ClientDb()];
            const { selectQueryBuilder } = mockSelectQueryBuilder<ClientDb>(sandbox);
            selectQueryBuilder.where.returnsThis();
            selectQueryBuilder.andWhere.returnsThis();
            selectQueryBuilder.orWhere.returnsThis();
            selectQueryBuilder.skip.returnsThis();
            selectQueryBuilder.take.returnsThis();
            selectQueryBuilder.getManyAndCount.resolves([clientDbs, clientDbs.length]);

            const clientRepository = new ClientRepository();
            const [list, count] = await clientRepository.findAndCount({ keyword: 'test', status: ClientStatus.Actived, skip: 0, limit: 10 });

            const whereExpression = mockWhereExpressionBuilder();
            const brackets = selectQueryBuilder.andWhere.firstCall.args[0] as Brackets;
            brackets.whereFactory(whereExpression);

            expect(list.length).to.eq(clientDbs.length);
            expect(count).to.eq(clientDbs.length);
        });
    });

    describe('Get by email', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Get by email', async () => {
            const data = new ClientDb();
            const { selectQueryBuilder } = mockSelectQueryBuilder<ClientDb>(sandbox);
            selectQueryBuilder.where.returnsThis();
            selectQueryBuilder.getOne.resolves(data);

            const clientRepository = new ClientRepository();
            const result = await clientRepository.getByEmail('test@localhost.com');

            expect(!!result).to.eq(true);
        });

        it('Get by email without data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<ClientDb>(sandbox);
            selectQueryBuilder.where.returnsThis();
            selectQueryBuilder.getOne.resolves();

            const clientRepository = new ClientRepository();
            const result = await clientRepository.getByEmail('test@localhost.com');

            expect(!result).to.eq(true);
        });
    });

    describe('Check email exist', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Check email exist', async () => {
            const data = new ClientDb();
            const { selectQueryBuilder } = mockSelectQueryBuilder<ClientDb>(sandbox);
            selectQueryBuilder.select.returnsThis();
            selectQueryBuilder.where.returnsThis();
            selectQueryBuilder.getOne.resolves(data);

            const clientRepository = new ClientRepository();
            const hasSucceed = await clientRepository.checkEmailExist('test@localhost.com');

            expect(hasSucceed).to.eq(true);
        });

        it('Check email not exist', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<ClientDb>(sandbox);
            selectQueryBuilder.select.returnsThis();
            selectQueryBuilder.where.returnsThis();
            selectQueryBuilder.getOne.resolves();

            const clientRepository = new ClientRepository();
            const hasSucceed = await clientRepository.checkEmailExist('test@localhost.com');

            expect(hasSucceed).to.eq(false);
        });
    });
});
