import { Manager } from 'domain/entities/user/Manager';
import { ManagerStatus } from 'domain/enums/user/ManagerStatus';
import { IRepository } from 'shared/database/interfaces/IRepository';

export interface IManagerRepository extends IRepository<Manager> {
    findAndCount(filter: { roleIds?: string[], keyword?: string, status?: ManagerStatus, skip: number, limit: number }): Promise<[Manager[], number]>;

    getByEmail(email: string): Promise<Manager | undefined>;

    checkEmailExist(email: string): Promise<boolean>;
}
