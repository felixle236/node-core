/* eslint-disable @typescript-eslint/no-empty-function */
import { SinonSandbox, SinonStubbedInstance } from 'sinon';
import * as typeorm from 'typeorm';
import { SoftDeleteQueryBuilder } from 'typeorm/query-builder/SoftDeleteQueryBuilder';

export type MockConnection = SinonStubbedInstance<typeorm.Connection>;
export type MockQueryRunner = typeorm.QueryRunner;
export type MockRepository<T> = SinonStubbedInstance<typeorm.Repository<T>>;
export type MockSelectQueryBuilder<T> = SinonStubbedInstance<typeorm.SelectQueryBuilder<T>>;
export type MockInsertQueryBuilder<T> = SinonStubbedInstance<typeorm.InsertQueryBuilder<T>>;
export type MockUpdateQueryBuilder<T> = SinonStubbedInstance<typeorm.UpdateQueryBuilder<T>>;
export type MockDeleteQueryBuilder<T> = SinonStubbedInstance<typeorm.DeleteQueryBuilder<T>>;
export type MockSoftDeleteQueryBuilder<T> = SinonStubbedInstance<SoftDeleteQueryBuilder<T>>;
export type MockRestoreQueryBuilder<T> = SinonStubbedInstance<SoftDeleteQueryBuilder<T>>;

export class MockInsertResult extends typeorm.InsertResult {
    constructor(...ids: string[]) {
        super();
        this.identifiers = ids.map(id => ({ id }));
    }
}

export class MockUpdateResult extends typeorm.UpdateResult {
    constructor(affected?: number) {
        super();
        this.affected = affected;
    }
}

export class MockDeleteResult extends typeorm.DeleteResult {
    constructor(affected?: number) {
        super();
        this.affected = affected;
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
export function mockQueryRunner(sandbox: SinonSandbox): {connection: MockConnection, queryRunner: MockQueryRunner} {
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
    return {
        connection,
        queryRunner
    };
}

/**
 * Mock repository
 */
export function mockRepository<T>(sandbox: SinonSandbox): { repository: MockRepository<T> } {
    const repository = sandbox.createStubInstance(typeorm.Repository);
    sandbox.stub(typeorm.ConnectionManager.prototype, 'get').returns({
        getRepository: () => repository
    } as unknown as typeorm.Connection);
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

/**
 * Mock update query builder
 */
export function mockUpdateQueryBuilder<T>(sandbox: SinonSandbox): { repository: MockRepository<T>, selectQueryBuilder: MockSelectQueryBuilder<T>, updateQueryBuilder: MockUpdateQueryBuilder<T> } {
    const updateQueryBuilder = sandbox.createStubInstance(typeorm.UpdateQueryBuilder);
    const { repository, selectQueryBuilder } = mockSelectQueryBuilder<T>(sandbox);
    selectQueryBuilder.update.returns(updateQueryBuilder as any);
    return { repository, selectQueryBuilder, updateQueryBuilder };
}

/**
 * Mock delete query builder
 */
export function mockDeleteQueryBuilder<T>(sandbox: SinonSandbox): { repository: MockRepository<T>, selectQueryBuilder: MockSelectQueryBuilder<T>, deleteQueryBuilder: MockDeleteQueryBuilder<T> } {
    const deleteQueryBuilder = sandbox.createStubInstance(typeorm.DeleteQueryBuilder);
    const { repository, selectQueryBuilder } = mockSelectQueryBuilder<T>(sandbox);
    selectQueryBuilder.delete.returns(deleteQueryBuilder as any);
    return { repository, selectQueryBuilder, deleteQueryBuilder };
}

/**
 * Mock delete query builder
 */
export function mockSoftDeleteQueryBuilder<T>(sandbox: SinonSandbox): { repository: MockRepository<T>, selectQueryBuilder: MockSelectQueryBuilder<T>, softDeleteQueryBuilder: MockSoftDeleteQueryBuilder<T> } {
    const softDeleteQueryBuilder = sandbox.createStubInstance(SoftDeleteQueryBuilder);
    const { repository, selectQueryBuilder } = mockSelectQueryBuilder<T>(sandbox);
    selectQueryBuilder.softDelete.returns(softDeleteQueryBuilder as any);
    return { repository, selectQueryBuilder, softDeleteQueryBuilder };
}

/**
 * Mock delete query builder
 */
export function mockRestoreQueryBuilder<T>(sandbox: SinonSandbox): { repository: MockRepository<T>, selectQueryBuilder: MockSelectQueryBuilder<T>, restoreQueryBuilder: MockRestoreQueryBuilder<T> } {
    const restoreQueryBuilder = sandbox.createStubInstance(SoftDeleteQueryBuilder);
    const { repository, selectQueryBuilder } = mockSelectQueryBuilder<T>(sandbox);
    selectQueryBuilder.restore.returns(restoreQueryBuilder as any);
    return { repository, selectQueryBuilder, restoreQueryBuilder };
}

/**
 * Mock where expression
 */
export function mockWhereExpression(): typeorm.WhereExpression {
    const whereExpression = {} as typeorm.WhereExpression;
    whereExpression.where = () => whereExpression;
    whereExpression.andWhere = () => whereExpression;
    whereExpression.orWhere = () => whereExpression;
    whereExpression.whereInIds = () => whereExpression;
    whereExpression.andWhereInIds = () => whereExpression;
    whereExpression.orWhereInIds = () => whereExpression;
    return whereExpression;
}
