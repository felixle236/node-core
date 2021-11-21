/* eslint-disable @typescript-eslint/ban-types */
import { randomUUID } from 'crypto';
import path from 'path';
import { DbContext } from 'infras/data/typeorm/DbContext';
import { DataType, IMemoryDb, newDb } from 'pg-mem';
import { Connection } from 'typeorm';

export const mockDb = (): IMemoryDb => {
    const db = newDb({
        autoCreateForeignKeyIndices: true
    });
    db.public.registerFunction({
        name: 'current_database',
        args: [],
        returns: DataType.text,
        implementation: () => 'db_test'
    });
    db.public.registerFunction({
        name: 'uuid_generate_v4',
        args: [],
        returns: DataType.text,
        implementation: randomUUID,
        impure: true
    });
    return db;
};

export const mockDbContext = async (db = mockDb(), entities?: Function[]): Promise<DbContext> => {
    const conn: Connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: entities || [path.join(__dirname, '../../infras/data/typeorm/entities/**/*{.js,.ts}')],
        subscribers: [path.join(__dirname, '../../infras/data/typeorm/subscribers/*{.js,.ts}')]
    });
    await conn.synchronize();
    return new DbContext(conn);
};
