import 'mocha';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { FindClientFilter } from '@gateways/repositories/user/IClientRepository';
import { mockSelectQueryBuilder, mockWhereExpression } from '@shared/test/MockTypeORM';
import { expect } from 'chai';
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

            const filter = new FindClientFilter();
            filter.setPagination(0, 10);

            const clientRepository = new ClientRepository();
            const [list, count] = await clientRepository.findAndCount(filter);

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

            const filter = new FindClientFilter();
            filter.setPagination(0, 10);

            const clientRepository = new ClientRepository();
            const [list, count] = await clientRepository.findAndCount(filter);

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

            const filter = new FindClientFilter();
            filter.setPagination(0, 10);
            filter.keyword = 'test';
            filter.status = ClientStatus.ACTIVED;

            const clientRepository = new ClientRepository();
            const [list, count] = await clientRepository.findAndCount(filter);

            const whereExpression = mockWhereExpression();
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

            expect(result).to.not.eq(null);
        });

        it('Get by email without data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<ClientDb>(sandbox);
            selectQueryBuilder.where.returnsThis();
            selectQueryBuilder.getOne.resolves();

            const clientRepository = new ClientRepository();
            const result = await clientRepository.getByEmail('test@localhost.com');

            expect(result).to.eq(null);
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
