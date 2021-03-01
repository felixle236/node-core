import * as validator from 'class-validator';
import { hashMD5 } from '../../../../libs/crypt';
import { MessageError } from '../../common/exceptions/message/MessageError';
import { SystemError } from '../../common/exceptions/SystemError';
import { AuthType } from '../../enums/auth/AuthType';
import { IAuth } from '../../types/auth/IAuth';
import { BaseEntity } from '../base/BaseEntity';
import { User } from '../user/User';

export class Auth extends BaseEntity<IAuth> implements IAuth {
    constructor(data?: IAuth) {
        super(data);
    }

    get id(): string {
        return this.data.id;
    }

    get userId(): string {
        return this.data.userId;
    }

    set userId(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'user');

        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'user');

        this.data.userId = val;
    }

    get type(): AuthType {
        return this.data.type;
    }

    set type(val: AuthType) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'type');

        if (!validator.isEnum(val, AuthType))
            throw new SystemError(MessageError.PARAM_INVALID, 'type');

        this.data.type = val;
    }

    get username(): string {
        return this.data.username;
    }

    set username(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'username');

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
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'password');
        if (val.length > 20)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'password', 20);

        const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()-_=+[{\]}\\|;:'",<.>/?]).{6,20}/;
        if (!regExp.test(val))
            throw new SystemError(MessageError.PARAM_LEN_AT_LEAST_AND_MAX_SPECIAL, 'password', 6, 20);

        this.data.password = this._hashPassword(val);
    }

    get forgotKey(): string | null {
        return this.data.forgotKey;
    }

    set forgotKey(val: string | null) {
        if (val && val.length > 128)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'forgot key', 128);
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

    /* handlers */

    private _hashPassword(password: string): string {
        return hashMD5(password, '$$');
    }

    comparePassword(password: string): boolean {
        return this.password === this._hashPassword(password);
    }
}
