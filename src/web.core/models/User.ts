import * as crypto from 'crypto';
import { Container } from 'typedi';
import { Gender } from '../../constants/Enums';
import { IUser } from '../interfaces/models/IUser';
import { Role } from './Role';
import { SystemError } from '../dtos/common/Exception';
import { Validator } from 'class-validator';
import { addSeconds } from '../../libs/date';
import { hashMD5 } from '../../libs/crypt';
import { mapModel } from '../../libs/common';
const validator = Container.get(Validator);

export class User implements IUser {
    constructor(private data = {} as IUser) { }

    get id(): number {
        return this.data.id;
    }

    get createdAt(): Date {
        return this.data.createdAt;
    }

    get updatedAt(): Date {
        return this.data.updatedAt;
    }

    get deletedAt(): Date | undefined {
        return this.data.deletedAt;
    }

    set deletedAt(val: Date | undefined) {
        this.data.deletedAt = val;
    }

    get roleId(): number {
        return this.data.roleId;
    }

    set roleId(val: number) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'role id');
        if (!validator.isPositive(val))
            throw new SystemError(1002, 'role id');
        this.data.roleId = val;
    }

    get firstName(): string {
        return this.data.firstName;
    }

    set firstName(val: string) {
        if (validator.isEmpty(val))
            throw new SystemError(1001, 'first name');
        if (!validator.isString(val))
            throw new SystemError(1002, 'first name');
        if (val.length > 20)
            throw new SystemError(2004, 'first name', 20);

        this.data.firstName = val;
    }

    get lastName(): string | undefined {
        return this.data.lastName;
    }

    set lastName(val: string | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isString(val))
                throw new SystemError(1002, 'last name');

            val = val!.trim();
            if (val.length > 20)
                throw new SystemError(2004, 'last name', 20);
        }

        this.data.lastName = val;
    }

    get fullName(): string {
        return this.data.firstName + (this.data.lastName ? ' ' + this.data.lastName : '');
    }

    get email(): string {
        return this.data.email;
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

        this.data.email = val;
    }

    get password(): string {
        return this.data.password;
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

        this.data.password = this.hashPassword(val);
    }

    get avatar(): string | undefined {
        return this.data.avatar;
    }

    set avatar(val: string | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isString(val))
                throw new SystemError(1002, 'avatar');

            val = val!.trim();
            if (val.length > 200)
                throw new SystemError(2004, 'avatar', 200);
        }

        this.data.avatar = val;
    }

    get gender(): Gender | undefined {
        return this.data.gender;
    }

    set gender(val: Gender | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isEnum(val, Gender))
                throw new SystemError(1002, 'gender');
        }

        this.data.gender = val;
    }

    get birthday(): Date | undefined {
        return this.data.birthday;
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

        this.data.birthday = val;
    }

    get phone(): string | undefined {
        return this.data.phone;
    }

    set phone(val: string | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isString(val))
                throw new SystemError(1002, 'phone');

            val = val!.trim();
            if (val.length > 20)
                throw new SystemError(2004, 'phone', 20);
        }

        this.data.phone = val;
    }

    get address(): string | undefined {
        return this.data.address;
    }

    set address(val: string | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isString(val))
                throw new SystemError(1002, 'address');

            val = val!.trim();
            if (val.length > 200)
                throw new SystemError(2004, 'address', 200);
        }

        this.data.address = val;
    }

    get culture(): string | undefined {
        return this.data.culture;
    }

    set culture(val: string | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isString(val))
                throw new SystemError(1002, 'culture');

            val = val!.trim();
            if (val.length !== 5)
                throw new SystemError(2001, 'culture', 5);
        }

        this.data.culture = val;
    }

    get currency(): string | undefined {
        return this.data.currency;
    }

    set currency(val: string | undefined) {
        if (validator.isNotEmpty(val)) {
            if (!validator.isString(val))
                throw new SystemError(1002, 'currency');

            val = val!.trim();
            if (val.length !== 3)
                throw new SystemError(2001, 'currency', 3);
        }

        this.data.currency = val;
    }

    get activeKey(): string | undefined {
        return this.data.activeKey;
    }

    set activeKey(val: string | undefined) {
        this.data.activeKey = val;
    }

    get activeExpire(): Date | undefined {
        return this.data.activeExpire;
    }

    set activeExpire(val: Date | undefined) {
        this.data.activeExpire = val;
    }

    get activedAt(): Date | undefined {
        return this.data.activedAt;
    }

    set activedAt(val: Date | undefined) {
        this.data.activedAt = val;
    }

    get forgotKey(): string | undefined {
        return this.data.forgotKey;
    }

    set forgotKey(val: string | undefined) {
        this.data.forgotKey = val;
    }

    get forgotExpire(): Date | undefined {
        return this.data.forgotExpire;
    }

    set forgotExpire(val: Date | undefined) {
        this.data.forgotExpire = val;
    }

    /* Relationship */

    get role(): Role | undefined {
        return mapModel(Role, this.data.role);
    }

    /* handlers */

    toData() {
        const data = {} as IUser;
        data.deletedAt = this.data.deletedAt;
        data.roleId = this.data.roleId;
        data.firstName = this.data.firstName;
        data.lastName = this.data.lastName;
        data.email = this.data.email;
        data.password = this.data.password;
        data.avatar = this.data.avatar;
        data.gender = this.data.gender;
        data.birthday = this.data.birthday;
        data.phone = this.data.phone;
        data.address = this.data.address;
        data.culture = this.data.culture;
        data.currency = this.data.currency;
        data.activeKey = this.data.activeKey;
        data.activeExpire = this.data.activeExpire;
        data.activedAt = this.data.activedAt;
        data.forgotKey = this.data.forgotKey;
        data.forgotExpire = this.data.forgotExpire;
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
        this.data.activeKey = crypto.randomBytes(32).toString('hex');
        this.data.activeExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);
        return this.data.activeKey;
    }

    /**
     * Generate forgot key with expire time.
     * Use to reset password feature.
     */
    generateForgotKey(): string {
        this.data.forgotKey = crypto.randomBytes(32).toString('hex');
        this.data.forgotExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);
        return this.data.forgotKey;
    }
}
