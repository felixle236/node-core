import { MessageError } from '../../common/exceptions/message/MessageError';
import { SystemError } from '../../common/exceptions/SystemError';
import { IRole } from '../../types/role/IRole';
import { BaseEntity } from '../base/BaseEntity';
import { User } from '../user/User';

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

    /* Relationship */

    get users(): User[] | undefined {
        return this.data.users && this.data.users.map(user => new User(user));
    }
}
