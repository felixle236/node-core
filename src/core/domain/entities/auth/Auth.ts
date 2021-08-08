import { AuthType } from '@domain/enums/auth/AuthType';
import { IAuth } from '@domain/interfaces/auth/IAuth';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { hashMD5 } from '@utils/Crypt';
import { isUUID } from 'class-validator';
import { BaseEntity } from '../base/BaseEntity';
import { User } from '../user/User';

export class Auth extends BaseEntity<string, IAuth> implements IAuth {
    get userId(): string {
        return this.data.userId;
    }

    set userId(val: string) {
        if (!isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'user');

        this.data.userId = val;
    }

    get type(): AuthType {
        return this.data.type;
    }

    set type(val: AuthType) {
        this.data.type = val;
    }

    get username(): string {
        return this.data.username;
    }

    set username(val: string) {
        val = val.trim();
        if (val.length < 6)
            throw new SystemError(MessageError.PARAM_LEN_GREATER_OR_EQUAL, 'username', 6);
        if (val.length > 120)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'username', 120);

        this.data.username = val;
    }

    get password(): string {
        return this.data.password;
    }

    set password(val: string) {
        const regExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()-_=+[{\]}\\|;:'",<.>/?]).{8,20}$/;
        if (!regExp.test(val))
            throw new SystemError(MessageError.PARAM_LEN_AT_LEAST_AND_MAX_SPECIAL, 'password', 6, 20);

        this.data.password = this._hashPassword(val);
    }

    get forgotKey(): string | null {
        return this.data.forgotKey;
    }

    set forgotKey(val: string | null) {
        if (val && val.length !== 64)
            throw new SystemError(MessageError.PARAM_LEN_EQUAL, 'forgot key', 64);
        this.data.forgotKey = val;
    }

    get forgotExpire(): Date | null {
        return this.data.forgotExpire;
    }

    set forgotExpire(val: Date | null) {
        this.data.forgotExpire = val;
    }

    /* Relationship */

    get user(): User | null {
        return this.data.user ? new User(this.data.user) : null;
    }

    /* Handlers */

    private _hashPassword(password: string): string {
        return hashMD5(password, '$$');
    }

    comparePassword(password: string): boolean {
        return this.password === this._hashPassword(password);
    }
}
