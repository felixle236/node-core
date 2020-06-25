import * as validator from 'class-validator';
import { IPermission } from '../interfaces/models/IPermission';
import { Role } from './Role';
import { SystemError } from '../dtos/common/Exception';
import { mapModel } from '../../libs/common';

export class Permission implements IPermission {
    constructor(private readonly _data = {} as IPermission) { }

    get id(): number {
        return this._data.id;
    }

    get roleId(): number {
        return this._data.roleId;
    }

    set roleId(val: number) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'role id');
        if (!validator.isPositive(val))
            throw new SystemError(1002, 'role id');
        this._data.roleId = val;
    }

    get claim(): number {
        return this._data.claim;
    }

    set claim(val: number) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'claim');
        if (!validator.isPositive(val))
            throw new SystemError(1002, 'claim');

        this._data.claim = val;
    }

    /* Relationship */

    get role(): Role | undefined {
        return mapModel(Role, this._data.role);
    }

    /* handlers */

    toData() {
        const data = {} as IPermission;
        data.roleId = this._data.roleId;
        data.claim = this._data.claim;
        return data;
    }
}
