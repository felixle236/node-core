/* eslint-disable @typescript-eslint/no-empty-function */
import { IDbConnection } from '@shared/database/interfaces/IDbConnection';
import { IDbContext } from '@shared/database/interfaces/IDbContext';

const connection = {
    async clearCaching(): Promise<void> {},
    async runTransaction(cb: (queryRunner: any) => Promise<any>) {
        return await cb(undefined);
    },
    async runMigrations(): Promise<any> {}
} as IDbConnection;

export const mockDbContext = (): IDbContext => {
    return {
        getConnection() {
            return connection;
        },
        async createConnection() {
            return connection;
        },
        async destroyConnection() {}
    };
};
