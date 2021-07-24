import { IManager } from '@domain/interfaces/user/IManager';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { isEmail, isEnum } from 'class-validator';
import { UserBase } from './User';
import { ManagerStatus } from '../../enums/user/ManagerStatus';

export class Manager extends UserBase<IManager> implements IManager {
    get email(): string {
        return this.data.email;
    }

    set email(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'email');

        val = val.trim().toLowerCase();
        if (!isEmail(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'email');

        if (val.length > 200)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'email', 200);

        this.data.email = val;
    }

    get status(): ManagerStatus {
        return this.data.status;
    }

    set status(val: ManagerStatus) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'status');

        if (!isEnum(val, ManagerStatus))
            throw new SystemError(MessageError.PARAM_INVALID, 'status');

        this.data.status = val;
    }

    get archivedAt(): Date | null {
        return this.data.archivedAt;
    }

    set archivedAt(val: Date | null) {
        this.data.archivedAt = val;
    }

    /* Relationship */

    /* Handlers */
}
