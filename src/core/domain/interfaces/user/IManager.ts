import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { IUser } from './IUser';

export interface IManager extends IUser {
    email: string;
    status: ManagerStatus;
    archivedAt: Date | null;

    /* Relationship */
}
