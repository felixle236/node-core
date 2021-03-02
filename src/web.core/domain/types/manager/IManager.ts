import { ManagerStatus } from '../../enums/manager/ManagerStatus';
import { IUser } from '../user/IUser';

export interface IManager extends IUser {
    status: ManagerStatus;
    email: string;
    archivedAt: Date | null;
}
