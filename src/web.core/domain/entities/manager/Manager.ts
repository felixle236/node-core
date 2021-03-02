import * as validator from 'class-validator';
import { MessageError } from '../../common/exceptions/message/MessageError';
import { SystemError } from '../../common/exceptions/SystemError';
import { ManagerStatus } from '../../enums/manager/ManagerStatus';
import { IManager } from '../../types/manager/IManager';
import { UserBase } from '../user/User';

export class Manager extends UserBase<IManager> implements IManager {
    constructor(data?: IManager) {
        super(data);
    }

    get status(): ManagerStatus {
        return this.data.status;
    }

    set status(val: ManagerStatus) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'status');

        if (!validator.isEnum(val, ManagerStatus))
            throw new SystemError(MessageError.PARAM_INVALID, 'status');

        this.data.status = val;
    }

    get email(): string {
        return this.data.email;
    }

    set email(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'email');

        val = val.trim().toLowerCase();
        if (!validator.isEmail(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'email');

        if (val.length > 120)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'email', 120);

        this.data.email = val;
    }

    get archivedAt(): Date | null {
        return this.data.archivedAt;
    }

    set archivedAt(val: Date | null) {
        this.data.archivedAt = val;
    }
}
