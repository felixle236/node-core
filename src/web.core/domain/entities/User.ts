import * as crypto from 'crypto';
import * as validator from 'class-validator';
import { GenderType } from '../enums/GenderType';
import { IUser } from '../types/IUser';
import { Role } from './Role';
import { SystemError } from '../common/exceptions/SystemError';
import { UserStatus } from '../enums/UserStatus';
import { addSeconds } from '../../../libs/date';
import { hashMD5 } from '../../../libs/crypt';

export class User implements IUser {
    constructor(private readonly _entity = {} as IUser) { }

    get id(): number {
        return this._entity.id;
    }

    get createdAt(): Date {
        return this._entity.createdAt;
    }

    get updatedAt(): Date {
        return this._entity.updatedAt;
    }

    get deletedAt(): Date | undefined {
        return this._entity.deletedAt;
    }

    get roleId(): number {
        return this._entity.roleId;
    }

    set roleId(val: number) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'role id');
        if (!validator.isPositive(val))
            throw new SystemError(1002, 'role id');
        this._entity.roleId = val;
    }

    get status(): UserStatus {
        return this._entity.status;
    }

    set status(val: UserStatus) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'status');
        if (!validator.isEnum(val, UserStatus))
            throw new SystemError(1002, 'status');

        this._entity.status = val;
    }

    get firstName(): string {
        return this._entity.firstName;
    }

    set firstName(val: string) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'first name');
        if (!validator.isString(val))
            throw new SystemError(1002, 'first name');
        if (val.length > 20)
            throw new SystemError(2004, 'first name', 20);

        this._entity.firstName = val;
    }

    get lastName(): string | undefined {
        return this._entity.lastName;
    }

    set lastName(val: string | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isString(val))
                throw new SystemError(1002, 'last name');

            val = val!.trim();
            if (val.length > 20)
                throw new SystemError(2004, 'last name', 20);
        }

        this._entity.lastName = val;
    }

    get fullName(): string {
        return this._entity.firstName + (this._entity.lastName ? ' ' + this._entity.lastName : '');
    }

    get email(): string {
        return this._entity.email;
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

        this._entity.email = val;
    }

    get password(): string {
        return this._entity.password;
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

        this._entity.password = this.hashPassword(val);
    }

    get avatar(): string | undefined {
        return this._entity.avatar;
    }

    set avatar(val: string | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isString(val))
                throw new SystemError(1002, 'avatar');

            val = val!.trim();
            if (val.length > 200)
                throw new SystemError(2004, 'avatar', 200);
        }

        this._entity.avatar = val;
    }

    get gender(): GenderType | undefined {
        return this._entity.gender;
    }

    set gender(val: GenderType | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isEnum(val, GenderType))
                throw new SystemError(1002, 'gender');
        }

        this._entity.gender = val;
    }

    get birthday(): Date | undefined {
        return this._entity.birthday;
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

        this._entity.birthday = val;
    }

    get phone(): string | undefined {
        return this._entity.phone;
    }

    set phone(val: string | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isString(val))
                throw new SystemError(1002, 'phone');

            val = val!.trim();
            if (val.length > 20)
                throw new SystemError(2004, 'phone', 20);
        }

        this._entity.phone = val;
    }

    get address(): string | undefined {
        return this._entity.address;
    }

    set address(val: string | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isString(val))
                throw new SystemError(1002, 'address');

            val = val!.trim();
            if (val.length > 200)
                throw new SystemError(2004, 'address', 200);
        }

        this._entity.address = val;
    }

    get culture(): string | undefined {
        return this._entity.culture;
    }

    set culture(val: string | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isString(val))
                throw new SystemError(1002, 'culture');

            val = val!.trim();
            if (val.length !== 5)
                throw new SystemError(2001, 'culture', 5);
        }

        this._entity.culture = val;
    }

    get currency(): string | undefined {
        return this._entity.currency;
    }

    set currency(val: string | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isString(val))
                throw new SystemError(1002, 'currency');

            val = val!.trim();
            if (val.length !== 3)
                throw new SystemError(2001, 'currency', 3);
        }

        this._entity.currency = val;
    }

    get activeKey(): string | undefined {
        return this._entity.activeKey;
    }

    get activeExpire(): Date | undefined {
        return this._entity.activeExpire;
    }

    get activedAt(): Date | undefined {
        return this._entity.activedAt;
    }

    get archivedAt(): Date | undefined {
        return this._entity.archivedAt;
    }

    get forgotKey(): string | undefined {
        return this._entity.forgotKey;
    }

    get forgotExpire(): Date | undefined {
        return this._entity.forgotExpire;
    }

    /* Relationship */

    get role(): Role | undefined {
        return this._entity.role && new Role(this._entity.role);
    }

    /* handlers */

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
    createActiveKey(): string {
        const activeKey = crypto.randomBytes(32).toString('hex');
        this._entity.activeKey = activeKey;
        this._entity.activeExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);
        return activeKey;
    }

    /**
     * Generate forgot key with expire time.
     * Use to reset password feature.
     */
    createForgotKey(): string {
        const forgotKey = crypto.randomBytes(32).toString('hex');
        this._entity.forgotKey = forgotKey;
        this._entity.forgotExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);
        return forgotKey;
    }

    resetPassword(password: string): void {
        this.password = password;
        this._entity.forgotKey = undefined;
        this._entity.forgotExpire = undefined;
    }

    active(): void {
        this._entity.status = UserStatus.ACTIVED;
        this._entity.activeKey = undefined;
        this._entity.activeExpire = undefined;
        this._entity.activedAt = new Date();
    }

    archive(): void {
        this._entity.status = UserStatus.ARCHIVED;
        this._entity.archivedAt = new Date();
    }
}
