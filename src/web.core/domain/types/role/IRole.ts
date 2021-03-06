import { IEntity } from '../base/IEntity';
import { IUser } from '../user/IUser';

export interface IRole extends IEntity {
    id: string;
    name: string;

    /* Relationship */

    users: IUser[] | null;
}
