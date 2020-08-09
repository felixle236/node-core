import * as validator from 'class-validator';
import { IRole } from '../types/IRole';
import { SystemError } from '../common/exceptions/SystemError';
import { User } from './User';

export class Role implements IRole {
    constructor(private readonly _entity = {} as IRole) { }

    get id(): number {
        return this._entity.id;
    }

    get createdAt(): Date {
        return this._entity.createdAt;
    }

    get updatedAt(): Date {
        return this._entity.updatedAt;
    }

    get deletedAt(): Date | undefined {
        return this._entity.deletedAt;
    }

    get name(): string {
        return this._entity.name;
    }

    set name(val: string) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'name');
        if (!validator.isString(val))
            throw new SystemError(1002, 'name');
        if (val.length > 50)
            throw new SystemError(2004, 'name', 50);

        this._entity.name = val;
    }

    get level(): number {
        return this._entity.level;
    }

    set level(val: number) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'level');
        if (!validator.isPositive(val))
            throw new SystemError(1002, 'level');
        if (val > 100)
            throw new SystemError(2004, 'level', 100);

        this._entity.level = val;
    }

    /* Relationship */

    get users(): User[] | undefined {
        return this._entity.users && this._entity.users.map(user => new User(user));
    }
}
