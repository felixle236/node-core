import 'mocha';
import { mockQueryRunner, mockSelectQueryBuilder } from '@shared/test/MockTypeORM';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { v4 } from 'uuid';
import { AuthRepository } from './AuthRepository';
import { AuthDb } from '../../entities/auth/AuthDb';

describe('Authorization repository', () => {
    const sandbox = createSandbox();

    describe('Get all by user', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Get all by user', async () => {
            const authDbs = [new AuthDb(), new AuthDb()];
            const { selectQueryBuilder } = mockSelectQueryBuilder<AuthDb>(sandbox);
            selectQueryBuilder.where.returnsThis();
            selectQueryBuilder.getMany.resolves(authDbs);

            const authRepository = new AuthRepository();
            const list = await authRepository.getAllByUser(v4());

            expect(list.length).to.eq(authDbs.length);
        });

        it('Get all by user without data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<AuthDb>(sandbox);
            selectQueryBuilder.where.returnsThis();
            selectQueryBuilder.getMany.resolves([]);

            const authRepository = new AuthRepository();
            const list = await authRepository.getAllByUser(v4());

            expect(list.length).to.eq(0);
        });

        it('Get all by user with transaction', async () => {
            const authDbs = [new AuthDb(), new AuthDb()];
            const { queryRunner } = mockQueryRunner(sandbox);
            const { selectQueryBuilder } = mockSelectQueryBuilder<AuthDb>(sandbox);
            selectQueryBuilder.where.returnsThis();
            selectQueryBuilder.getMany.resolves(authDbs);

            const authRepository = new AuthRepository();
            const list = await authRepository.getAllByUser(v4(), queryRunner);

            expect(list.length).to.eq(authDbs.length);
        });
    });

    describe('Get by username', () => {
        afterEach(() => {
            sandbox.restore();
        });

        it('Get by username', async () => {
            const data = new AuthDb();
            const { selectQueryBuilder } = mockSelectQueryBuilder<AuthDb>(sandbox);
            selectQueryBuilder.innerJoinAndMapOne.returnsThis();
            selectQueryBuilder.where.returnsThis();
            selectQueryBuilder.getOne.resolves(data);

            const authRepository = new AuthRepository();
            const result = await authRepository.getByUsername(v4());

            expect(result).to.not.eq(null);
        });

        it('Get by username without data', async () => {
            const { selectQueryBuilder } = mockSelectQueryBuilder<AuthDb>(sandbox);
            selectQueryBuilder.innerJoinAndMapOne.returnsThis();
            selectQueryBuilder.where.returnsThis();
            selectQueryBuilder.getOne.resolves();

            const authRepository = new AuthRepository();
            const result = await authRepository.getByUsername(v4());

            expect(result).to.eq(null);
        });
    });
});
