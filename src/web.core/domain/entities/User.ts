import * as crypto from 'crypto';
import * as validator from 'class-validator';
import { BaseEntity } from './base/BaseEntity';
import { Container } from 'typedi';
import { GenderType } from '../enums/GenderType';
import { IStorageService } from '../../gateways/services/IStorageService';
import { IUser } from '../types/IUser';
import { Role } from './Role';
import { SystemError } from '../common/exceptions/SystemError';
import { UserStatus } from '../enums/UserStatus';
import { addSeconds } from '../../../libs/date';
import { hashMD5 } from '../../../libs/crypt';

export class User extends BaseEntity<IUser> implements IUser {
    private readonly _storageService: IStorageService = Container.get('storage.service');

    constructor(data?: IUser) {
        super(data);
    }

    get id(): number {
        return this.data.id;
    }

    get roleId(): number {
        return this.data.roleId;
    }

    set roleId(val: number) {
        if (!val)
            throw new SystemError(1001, 'role id');
        if (!validator.isPositive(val))
            throw new SystemError(1002, 'role id');

        this.data.roleId = val;
    }

    get status(): UserStatus {
        return this.data.status;
    }

    set status(val: UserStatus) {
        if (!val)
            throw new SystemError(1001, 'status');
        if (!validator.isEnum(val, UserStatus))
            throw new SystemError(1002, 'status');

        this.data.status = val;
    }

    get firstName(): string {
        return this.data.firstName;
    }

    set firstName(val: string) {
        if (!val)
            throw new SystemError(1001, 'first name');

        val = val.trim();
        if (val.length > 20)
            throw new SystemError(2004, 'first name', 20);

        this.data.firstName = val;
    }

    get lastName(): string | undefined {
        return this.data.lastName;
    }

    set lastName(val: string | undefined) {
        if (val) {
            val = val.trim();
            if (val.length > 20)
                throw new SystemError(2004, 'last name', 20);
        }
        this.data.lastName = val;
    }

    get email(): string {
        return this.data.email;
    }

    set email(val: string) {
        if (!val)
            throw new SystemError(1001, 'email');

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
        if (!val)
            throw new SystemError(1001, 'password');
        if (val.length > 20)
            throw new SystemError(2004, 'password', 20);

        const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()-_=+[{\]}\\|;:'",<.>/?]).{6,20}/;
        if (!regExp.test(val))
            throw new SystemError(3002, 'password', 6, 20);

        this.data.password = this._hashPassword(val);
    }

    get avatar(): string | undefined {
        return this.data.avatar && this._storageService.mapUrl(this.data.avatar);
    }

    set avatar(val: string | undefined) {
        if (val) {
            val = val.trim();
            if (val.length > 200)
                throw new SystemError(2004, 'avatar', 200);
        }
        this.data.avatar = val;
    }

    get gender(): GenderType | undefined {
        return this.data.gender;
    }

    set gender(val: GenderType | undefined) {
        if (val && !validator.isEnum(val, GenderType))
            throw new SystemError(1002, 'gender');
        this.data.gender = val;
    }

    get birthday(): Date | undefined {
        return this.data.birthday;
    }

    set birthday(val: Date | undefined) {
        if (val) {
            val = new Date(val.getFullYear(), val.getMonth(), val.getDate());
            const now = new Date();
            if (val.getTime() > new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() || now.getFullYear() - val.getFullYear() > 100)
                throw new SystemError(1002, 'birthday');
        }
        this.data.birthday = val;
    }

    get birthdayDisplay(): string | undefined {
        return this.data.birthday && `${this.data.birthday.getFullYear()}-${this.data.birthday.getMonth() + 1}-${this.data.birthday.getDate()}`;
    }

    get phone(): string | undefined {
        return this.data.phone;
    }

    set phone(val: string | undefined) {
        if (val) {
            val = val.trim();
            if (val.length > 20)
                throw new SystemError(2004, 'phone', 20);
        }

        this.data.phone = val;
    }

    get address(): string | undefined {
        return this.data.address;
    }

    set address(val: string | undefined) {
        if (val) {
            val = val.trim();
            if (val.length > 200)
                throw new SystemError(2004, 'address', 200);
        }

        this.data.address = val;
    }

    get culture(): string | undefined {
        return this.data.culture;
    }

    set culture(val: string | undefined) {
        if (val) {
            val = val.trim();
            if (val.length !== 5)
                throw new SystemError(2001, 'culture', 5);
        }

        this.data.culture = val;
    }

    get currency(): string | undefined {
        return this.data.currency;
    }

    set currency(val: string | undefined) {
        if (val) {
            val = val.trim();
            if (val.length !== 3)
                throw new SystemError(2001, 'currency', 3);
        }

        this.data.currency = val;
    }

    get activeKey(): string | undefined {
        return this.data.activeKey;
    }

    set activeKey(val: string | undefined) {
        if (val && val.length > 128)
            throw new SystemError(2004, 'active key', 128);
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

    get archivedAt(): Date | undefined {
        return this.data.archivedAt;
    }

    set archivedAt(val: Date | undefined) {
        this.data.archivedAt = val;
    }

    get forgotKey(): string | undefined {
        return this.data.forgotKey;
    }

    set forgotKey(val: string | undefined) {
        if (val && val.length > 128)
            throw new SystemError(2004, 'forgot key', 128);
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
        return this.data.role && new Role(this.data.role);
    }

    /* handlers */

    private _hashPassword(password: string): string {
        if (password)
            password = hashMD5(password, '$$88');
        return password;
    }

    comparePassword(password: string): boolean {
        return this.password === this._hashPassword(password);
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

    resetPassword(password: string): void {
        this.password = password;
        this.data.forgotKey = undefined;
        this.data.forgotExpire = undefined;
    }

    archive(): void {
        this.data.status = UserStatus.ARCHIVED;
        this.data.archivedAt = new Date();
    }
}
