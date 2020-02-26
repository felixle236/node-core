import { IPermission } from './IPermission';
import { IUser } from './IUser';

export interface IRole {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    name: string;
    level: number;

    users?: IUser[];
    permissions?: IPermission[];
}
