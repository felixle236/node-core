import * as validator from 'class-validator';
import { MessageError } from '../../common/exceptions/message/MessageError';
import { SystemError } from '../../common/exceptions/SystemError';
import { ClientStatus } from '../../enums/client/ClientStatus';
import { IClient } from '../../types/client/IClient';
import { UserBase } from '../user/User';

export class Client extends UserBase<IClient> implements IClient {
    constructor(data?: IClient) {
        super(data);
    }

    get status(): ClientStatus {
        return this.data.status;
    }

    set status(val: ClientStatus) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'status');

        if (!validator.isEnum(val, ClientStatus))
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

    get phone(): string | null {
        return this.data.phone;
    }

    set phone(val: string | null) {
        if (val) {
            val = val.trim();
            if (val.length > 20)
                throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'phone', 20);
        }

        this.data.phone = val;
    }

    get address(): string | null {
        return this.data.address;
    }

    set address(val: string | null) {
        if (val) {
            val = val.trim();
            if (val.length > 200)
                throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'address', 200);
        }

        this.data.address = val;
    }

    get culture(): string | null {
        return this.data.culture;
    }

    set culture(val: string | null) {
        if (val) {
            val = val.trim();
            if (val.length !== 5)
                throw new SystemError(MessageError.PARAM_LEN_EQUAL, 'culture', 5);
        }

        this.data.culture = val;
    }

    get currency(): string | null {
        return this.data.currency;
    }

    set currency(val: string | null) {
        if (val) {
            val = val.trim();
            if (val.length !== 3)
                throw new SystemError(MessageError.PARAM_LEN_EQUAL, 'currency', 3);
        }

        this.data.currency = val;
    }

    get activeKey(): string | null {
        return this.data.activeKey;
    }

    set activeKey(val: string | null) {
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
}
