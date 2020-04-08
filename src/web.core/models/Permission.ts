import { Container } from 'typedi';
import { IPermission } from '../interfaces/models/IPermission';
import { Role } from './Role';
import { SystemError } from '../dtos/common/Exception';
import { Validator } from 'class-validator';
import { mapModel } from '../../libs/common';
const validator = Container.get(Validator);

export class Permission implements IPermission {
    constructor(private data = {} as IPermission) { }

    get id(): number {
        return this.data.id;
    }

    get roleId(): number {
        return this.data.roleId;
    }

    set roleId(val: number) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'role id');
        if (!validator.isPositive(val))
            throw new SystemError(1002, 'role id');
        this.data.roleId = val;
    }

    get claim(): number {
        return this.data.claim;
    }

    set claim(val: number) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'claim');
        if (!validator.isPositive(val))
            throw new SystemError(1002, 'claim');

        this.data.claim = val;
    }

    /* Relationship */

    get role(): Role | undefined {
        return mapModel(Role, this.data.role);
    }

    /* handlers */

    toData() {
        const data = {} as IPermission;
        data.roleId = this.data.roleId;
        data.claim = this.data.claim;
        return data;
    }
}
