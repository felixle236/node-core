import { QueryRunner } from 'typeorm';

export interface IWrite<T> {
    create(data: T, queryRunner?: QueryRunner): Promise<number | string | undefined>
    update(id: number | string, data: T): Promise<boolean>;
    delete(id: number | string): Promise<boolean>;
}
