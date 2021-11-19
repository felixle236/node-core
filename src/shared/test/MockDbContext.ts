import { DbQuerySession } from 'shared/database/DbTypes';
import { IDbConnection } from 'shared/database/interfaces/IDbConnection';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { mockFunction } from './MockFunction';

const connection = {
    clearCaching: mockFunction(),
    async runTransaction(cb: (querySession: DbQuerySession) => Promise<any>) {
        return await cb(undefined);
    },
    runMigrations: mockFunction()
} as IDbConnection;

export const mockDbContext = (): IDbContext => {
    return {
        getConnection: mockFunction(connection),
        createConnection: mockFunction(connection),
        destroyConnection: mockFunction()
    };
};
