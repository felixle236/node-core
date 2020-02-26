import { Container } from 'typedi';
import { IRole } from '../interfaces/models/IRole';
import { Permission } from './Permission';
import { SystemError } from '../dtos/common/Exception';
import { User } from './User';
import { Validator } from 'class-validator';
import { mapModels } from '../../libs/common';
const validator = Container.get(Validator);

export class Role implements IRole {
    constructor(private data = {} as IRole) { }

    get id(): number {
        return this.data.id;
    }

    get createdAt(): Date {
        return this.data.createdAt;
    }

    get updatedAt(): Date {
        return this.data.updatedAt;
    }

    get deletedAt(): Date | undefined {
        return this.data.deletedAt;
    }

    set deletedAt(val: Date | undefined) {
        this.data.deletedAt = val;
    }

    get name(): string {
        return this.data.name;
    }

    set name(val: string) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'name');
        if (!validator.isString(val))
            throw new SystemError(1002, 'name');
        if (val.length > 50)
            throw new SystemError(2004, 'name', 50);

        this.data.name = val;
    }

    get level(): number {
        return this.data.level;
    }

    set level(val: number) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'level');
        if (!validator.isPositive(val))
            throw new SystemError(1002, 'level');
        if (val > 100)
            throw new SystemError(2004, 'level', 100);

        this.data.level = val;
    }

    /* Relationship */

    get users(): User[] | undefined {
        return this.data.users && mapModels(User, this.data.users);
    }

    get permissions(): Permission[] | undefined {
        return this.data.permissions && mapModels(Permission, this.data.permissions);
    }

    /* handlers */

    toData() {
        const data = {} as IRole;
        data.id = this.data.id;
        data.deletedAt = this.data.deletedAt;
        data.name = this.data.name;
        data.level = this.data.level;
        return data;
    }
}
