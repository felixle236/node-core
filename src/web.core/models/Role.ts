import * as validator from 'class-validator';
import { IRole } from '../interfaces/models/IRole';
import { Permission } from './Permission';
import { SystemError } from '../dtos/common/Exception';
import { User } from './User';
import { mapModels } from '../../libs/common';

export class Role implements IRole {
    constructor(private readonly _data = {} as IRole) { }

    get id(): number {
        return this._data.id;
    }

    get createdAt(): Date {
        return this._data.createdAt;
    }

    get updatedAt(): Date {
        return this._data.updatedAt;
    }

    get deletedAt(): Date | undefined {
        return this._data.deletedAt;
    }

    get name(): string {
        return this._data.name;
    }

    set name(val: string) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'name');
        if (!validator.isString(val))
            throw new SystemError(1002, 'name');
        if (val.length > 50)
            throw new SystemError(2004, 'name', 50);

        this._data.name = val;
    }

    get level(): number {
        return this._data.level;
    }

    set level(val: number) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'level');
        if (!validator.isPositive(val))
            throw new SystemError(1002, 'level');
        if (val > 100)
            throw new SystemError(2004, 'level', 100);

        this._data.level = val;
    }

    /* Relationship */

    get users(): User[] | undefined {
        return this._data.users && mapModels(User, this._data.users);
    }

    get permissions(): Permission[] | undefined {
        return this._data.permissions && mapModels(Permission, this._data.permissions);
    }

    /* handlers */

    toData() {
        const data = {} as IRole;
        data.id = this._data.id;
        data.name = this._data.name;
        data.level = this._data.level;
        return data;
    }
}
