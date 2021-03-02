import { ClientStatus } from '../../enums/client/ClientStatus';
import { IUser } from '../user/IUser';

export interface IClient extends IUser {
    status: ClientStatus;
    email: string;
    phone: string | null;
    address: string | null;
    culture: string | null;
    currency: string | null;
    activeKey: string | null;
    activeExpire: Date | null;
    activedAt: Date | null;
    archivedAt: Date | null;
}
