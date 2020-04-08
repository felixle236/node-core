import { IRole } from './IRole';

export interface IPermission {
    id: number;
    roleId: number;
    claim: number;

    role?: IRole;
}
