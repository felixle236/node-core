import { IEntity } from './base/IEntity';
import { IUser } from './IUser';

export interface IRole extends IEntity {
    id: string;
    name: string;

    users?: IUser[];
}
