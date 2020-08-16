import { IEntity } from './base/IEntity';
import { IUser } from './IUser';

export interface IRole extends IEntity {
    id: number;
    name: string;
    level: number;

    users?: IUser[];
}
