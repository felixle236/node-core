import * as validator from 'class-validator';
import { BaseEntity } from './base/BaseEntity';
import { IRole } from '../types/IRole';
import { MessageError } from '../common/exceptions/message/MessageError';
import { SystemError } from '../common/exceptions/SystemError';
import { User } from './User';

export class Role extends BaseEntity<IRole> implements IRole {
    constructor(data?: IRole) {
        super(data);
    }

    get id(): string {
        return this.data.id;
    }

    get name(): string {
        return this.data.name;
    }

    set name(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'name');
        if (val.length > 50)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'name', 50);

        this.data.name = val;
    }

    get level(): number {
        return this.data.level;
    }

    set level(val: number) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'level');
        if (!validator.isPositive(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'level');
        if (val > 100)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'level', 100);

        this.data.level = val;
    }

    /* Relationship */

    get users(): User[] | undefined {
        return this.data.users && this.data.users.map(user => new User(user));
    }
}
