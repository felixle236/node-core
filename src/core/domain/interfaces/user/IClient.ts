import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { IUser } from './IUser';

export interface IClient extends IUser {
    email: string;
    phone: string | null;
    address: string | null;
    locale: string | null;
    status: ClientStatus;
    activeKey: string | null;
    activeExpire: Date | null;
    activedAt: Date | null;
    archivedAt: Date | null;

    /* Relationship */
}
