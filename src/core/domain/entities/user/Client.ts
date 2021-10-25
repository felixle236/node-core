import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { IClient } from '@domain/interfaces/user/IClient';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import localeCode from 'locale-code';
import { UserBase } from './User';

export class Client extends UserBase<IClient> implements IClient {
    get email(): string {
        return this.data.email;
    }

    set email(val: string) {
        this.data.email = val;
    }

    get phone(): string | null {
        return this.data.phone;
    }

    set phone(val: string | null) {
        this.data.phone = val;
    }

    get address(): string | null {
        return this.data.address;
    }

    set address(val: string | null) {
        this.data.address = val;
    }

    get locale(): string | null {
        return this.data.locale;
    }

    set locale(val: string | null) {
        if (val) {
            if (!localeCode.validate(val))
                throw new SystemError(MessageError.PARAM_INVALID, { t: 'locale' });
        }

        this.data.locale = val;
    }

    get status(): ClientStatus {
        return this.data.status;
    }

    set status(val: ClientStatus) {
        this.data.status = val;
    }

    get activeKey(): string | null {
        return this.data.activeKey;
    }

    set activeKey(val: string | null) {
        if (val && val.length !== 64)
            throw new SystemError(MessageError.PARAM_LEN_EQUAL, { t: 'activation_key' }, 64);
        this.data.activeKey = val;
    }

    get activeExpire(): Date | null {
        return this.data.activeExpire;
    }

    set activeExpire(val: Date | null) {
        this.data.activeExpire = val;
    }

    get activedAt(): Date | null {
        return this.data.activedAt;
    }

    set activedAt(val: Date | null) {
        this.data.activedAt = val;
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
