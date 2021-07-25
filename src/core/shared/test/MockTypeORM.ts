/* eslint-disable @typescript-eslint/no-empty-function */
import { SinonSandbox, SinonStubbedInstance } from 'sinon';
import * as typeorm from 'typeorm';

export type MockConnection = SinonStubbedInstance<typeorm.Connection>;
export type MockRepository<T> = SinonStubbedInstance<typeorm.Repository<T>>;
export type MockSelectQueryBuilder<T> = SinonStubbedInstance<typeorm.SelectQueryBuilder<T>>;
export type MockInsertQueryBuilder<T> = SinonStubbedInstance<typeorm.InsertQueryBuilder<T>>;

export class MockInsertResult extends typeorm.InsertResult {
    constructor(id: string) {
        super();
        this.identifiers = [{ id }];
    }
}

/**
 * Mock connection
 */
export function mockConnection(sandbox: SinonSandbox): MockConnection {
    const connection = sandbox.createStubInstance(typeorm.Connection);
    sandbox.stub(typeorm, 'getConnection').returns(connection as any);
    return connection;
}

/**
 * Mock query runner
 */
export function mockQueryRunner(sandbox: SinonSandbox): void {
    const queryRunner = {
        startTransaction: () => {},
        rollbackTransaction: () => {},
        release: () => {}
    } as typeorm.QueryRunner;
    const connection = mockConnection(sandbox);
    connection.createQueryRunner.returns(queryRunner);
    sandbox.stub(queryRunner, 'startTransaction').resolves();
    sandbox.stub(queryRunner, 'rollbackTransaction').resolves();
    sandbox.stub(queryRunner, 'release').resolves();
}

/**
 * Mock repository
 */
export function mockRepository<T>(sandbox: SinonSandbox): { repository: MockRepository<T> } {
    const repository = sandbox.createStubInstance(typeorm.Repository);
    sandbox.stub(typeorm, 'getRepository').returns(repository as any);
    return { repository };
}

/**
 * Mock select query builder
 */
export function mockSelectQueryBuilder<T>(sandbox: SinonSandbox): { repository: MockRepository<T>, selectQueryBuilder: MockSelectQueryBuilder<T> } {
    const selectQueryBuilder = sandbox.createStubInstance(typeorm.SelectQueryBuilder);
    const { repository } = mockRepository<T>(sandbox);
    repository.createQueryBuilder.returns(selectQueryBuilder as any);
    return { repository, selectQueryBuilder };
}

/**
 * Mock insert query builder
 */
export function mockInsertQueryBuilder<T>(sandbox: SinonSandbox): { repository: MockRepository<T>, selectQueryBuilder: MockSelectQueryBuilder<T>, insertQueryBuilder: MockInsertQueryBuilder<T> } {
    const insertQueryBuilder = sandbox.createStubInstance(typeorm.InsertQueryBuilder);
    const { repository, selectQueryBuilder } = mockSelectQueryBuilder<T>(sandbox);
    selectQueryBuilder.insert.returns(insertQueryBuilder as any);
    return { repository, selectQueryBuilder, insertQueryBuilder };
}
