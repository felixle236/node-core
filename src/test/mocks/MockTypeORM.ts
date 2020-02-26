import * as typeorm from 'typeorm';
import { createSandbox } from 'sinon';

const sandbox = createSandbox();
const connection = sandbox.createStubInstance(typeorm.Connection);
const repository = new typeorm.Repository<typeorm.ObjectLiteral>();
const manager = {
    connection,
    getRepository: () => repository
};
const queryRunner = {
    connect: () => {},
    startTransaction: () => {},
    rollbackTransaction: () => {},
    commitTransaction: () => {}
} as typeorm.QueryRunner;

connection.transaction.callsFake(async (fn: any) => fn(manager));
connection.getRepository.returns(repository as any);
connection.createQueryRunner.returns(queryRunner);

sandbox.stub(typeorm, 'getConnection').returns(connection as any);
sandbox.stub(typeorm, 'getManager').returns(manager as any);
sandbox.stub(typeorm, 'getRepository').returns(repository as any);
