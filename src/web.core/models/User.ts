import * as crypto from 'crypto';
import * as validator from 'class-validator';
import { GenderType } from '../../constants/Enums';
import { IUser } from '../interfaces/models/IUser';
import { Role } from './Role';
import { SystemError } from '../dtos/common/Exception';
import { addSeconds } from '../../libs/date';
import { hashMD5 } from '../../libs/crypt';
import { mapModel } from '../../libs/common';

export class User implements IUser {
    constructor(private readonly _data = {} as IUser) { }

    get id(): number {
        return this._data.id;
    }

    get createdAt(): Date {
        return this._data.createdAt;
    }

    get updatedAt(): Date {
        return this._data.updatedAt;
    }

    get deletedAt(): Date | undefined {
        return this._data.deletedAt;
    }

    get roleId(): number {
        return this._data.roleId;
    }

    set roleId(val: number) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'role id');
        if (!validator.isPositive(val))
            throw new SystemError(1002, 'role id');
        this._data.roleId = val;
    }

    get firstName(): string {
        return this._data.firstName;
    }

    set firstName(val: string) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'first name');
        if (!validator.isString(val))
            throw new SystemError(1002, 'first name');
        if (val.length > 20)
            throw new SystemError(2004, 'first name', 20);

        this._data.firstName = val;
    }

    get lastName(): string | undefined {
        return this._data.lastName;
    }

    set lastName(val: string | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isString(val))
                throw new SystemError(1002, 'last name');

            val = val!.trim();
            if (val.length > 20)
                throw new SystemError(2004, 'last name', 20);
        }

        this._data.lastName = val;
    }

    get fullName(): string {
        return this._data.firstName + (this._data.lastName ? ' ' + this._data.lastName : '');
    }

    get email(): string {
        return this._data.email;
    }

    set email(val: string) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'email');
        if (!validator.isString(val))
            throw new SystemError(1002, 'email');

        val = val.trim().toLowerCase();

        if (!validator.isEmail(val))
            throw new SystemError(1002, 'email');
        if (val.length > 120)
            throw new SystemError(2004, 'email', 120);

        this._data.email = val;
    }

    get password(): string {
        return this._data.password;
    }

    set password(val: string) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'password');
        if (!validator.isString(val))
            throw new SystemError(1002, 'password');
        if (val.length > 20)
            throw new SystemError(2004, 'password', 20);

        const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()-_=+[{\]}\\|;:'",<.>/?]).{6,20}/;
        if (!regExp.test(val))
            throw new SystemError(3002, 'password', 6, 20);

        this._data.password = this.hashPassword(val);
    }

    get avatar(): string | undefined {
        return this._data.avatar;
    }

    set avatar(val: string | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isString(val))
                throw new SystemError(1002, 'avatar');

            val = val!.trim();
            if (val.length > 200)
                throw new SystemError(2004, 'avatar', 200);
        }

        this._data.avatar = val;
    }

    get gender(): GenderType | undefined {
        return this._data.gender;
    }

    set gender(val: GenderType | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isEnum(val, GenderType))
                throw new SystemError(1002, 'gender');
        }

        this._data.gender = val;
    }

    get birthday(): Date | undefined {
        return this._data.birthday;
    }

    set birthday(val: Date | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isDate(val))
                throw new SystemError(1002, 'birthday');

            val = new Date(val!.getFullYear(), val!.getMonth(), val!.getDate());
            const now = new Date();
            if (val.getTime() > new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime())
                throw new SystemError(1002, 'birthday');
        }

        this._data.birthday = val;
    }

    get phone(): string | undefined {
        return this._data.phone;
    }

    set phone(val: string | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isString(val))
                throw new SystemError(1002, 'phone');

            val = val!.trim();
            if (val.length > 20)
                throw new SystemError(2004, 'phone', 20);
        }

        this._data.phone = val;
    }

    get address(): string | undefined {
        return this._data.address;
    }

    set address(val: string | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isString(val))
                throw new SystemError(1002, 'address');

            val = val!.trim();
            if (val.length > 200)
                throw new SystemError(2004, 'address', 200);
        }

        this._data.address = val;
    }

    get culture(): string | undefined {
        return this._data.culture;
    }

    set culture(val: string | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isString(val))
                throw new SystemError(1002, 'culture');

            val = val!.trim();
            if (val.length !== 5)
                throw new SystemError(2001, 'culture', 5);
        }

        this._data.culture = val;
    }

    get currency(): string | undefined {
        return this._data.currency;
    }

    set currency(val: string | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isString(val))
                throw new SystemError(1002, 'currency');

            val = val!.trim();
            if (val.length !== 3)
                throw new SystemError(2001, 'currency', 3);
        }

        this._data.currency = val;
    }

    get activeKey(): string | undefined {
        return this._data.activeKey;
    }

    set activeKey(val: string | undefined) {
        this._data.activeKey = val;
    }

    get activeExpire(): Date | undefined {
        return this._data.activeExpire;
    }

    set activeExpire(val: Date | undefined) {
        this._data.activeExpire = val;
    }

    get activedAt(): Date | undefined {
        return this._data.activedAt;
    }

    set activedAt(val: Date | undefined) {
        this._data.activedAt = val;
    }

    get forgotKey(): string | undefined {
        return this._data.forgotKey;
    }

    set forgotKey(val: string | undefined) {
        this._data.forgotKey = val;
    }

    get forgotExpire(): Date | undefined {
        return this._data.forgotExpire;
    }

    set forgotExpire(val: Date | undefined) {
        this._data.forgotExpire = val;
    }

    /* Relationship */

    get role(): Role | undefined {
        return mapModel(Role, this._data.role);
    }

    /* handlers */

    toData() {
        const data = {} as IUser;
        data.roleId = this._data.roleId;
        data.firstName = this._data.firstName;
        data.lastName = this._data.lastName;
        data.email = this._data.email;
        data.password = this._data.password;
        data.avatar = this._data.avatar;
        data.gender = this._data.gender;
        data.birthday = this._data.birthday;
        data.phone = this._data.phone;
        data.address = this._data.address;
        data.culture = this._data.culture;
        data.currency = this._data.currency;
        data.activeKey = this._data.activeKey;
        data.activeExpire = this._data.activeExpire;
        data.activedAt = this._data.activedAt;
        data.forgotKey = this._data.forgotKey;
        data.forgotExpire = this._data.forgotExpire;
        return data;
    }

    hashPassword(password: string): string {
        if (password)
            password = hashMD5(password, '$$88');
        return password;
    }

    static getMaxAvatarSize(): number {
        return 1024 * 1024 * 2; // 2MB
    }

    validateAvatarSize(size: number): void {
        if (size > User.getMaxAvatarSize())
            throw new SystemError(3005, 'image', User.getMaxAvatarSize() / 1024, 'KB');
    }

    validateAvatarFormat(extension: string): void {
        if (!['jpeg', 'jpg', 'png', 'gif'].includes(extension))
            throw new SystemError(2006, 'image', 'JPEG (.jpeg/.jpg), GIF (.gif), PNG (.png)');
    }

    getAvatarPath(extension: string): string {
        return `images/avatar/${this.id}.${extension}`;
    }

    /**
     * Generate active key with expire time.
     * Use to active/re-active user feature.
     */
    generateActiveKey(): string {
        this._data.activeKey = crypto.randomBytes(32).toString('hex');
        this._data.activeExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);
        return this._data.activeKey;
    }

    /**
     * Generate forgot key with expire time.
     * Use to reset password feature.
     */
    generateForgotKey(): string {
        this._data.forgotKey = crypto.randomBytes(32).toString('hex');
        this._data.forgotExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);
        return this._data.forgotKey;
    }
}
