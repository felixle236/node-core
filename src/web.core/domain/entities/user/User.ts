import * as validator from 'class-validator';
import { STORAGE_URL } from '../../../../configs/Configuration';
import { MessageError } from '../../common/exceptions/message/MessageError';
import { SystemError } from '../../common/exceptions/SystemError';
import { RoleId } from '../../enums/role/RoleId';
import { GenderType } from '../../enums/user/GenderType';
import { UserStatus } from '../../enums/user/UserStatus';
import { IUser } from '../../types/user/IUser';
import { BaseEntity } from '../base/BaseEntity';
import { Role } from '../role/Role';

export class User extends BaseEntity<IUser> implements IUser {
    constructor(data?: IUser) {
        super(data);
    }

    get id(): string {
        return this.data.id;
    }

    get roleId(): RoleId {
        return this.data.roleId;
    }

    set roleId(val: RoleId) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'role');

        if (!validator.isUUID(val) || !validator.isEnum(val, RoleId))
            throw new SystemError(MessageError.PARAM_INVALID, 'role');

        this.data.roleId = val;
    }

    get status(): UserStatus {
        return this.data.status;
    }

    set status(val: UserStatus) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'status');

        if (!validator.isEnum(val, UserStatus))
            throw new SystemError(MessageError.PARAM_INVALID, 'status');

        this.data.status = val;
    }

    get firstName(): string {
        return this.data.firstName;
    }

    set firstName(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'first name');

        val = val.trim();
        if (val.length > 20)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'first name', 20);

        this.data.firstName = val;
    }

    get lastName(): string | null {
        return this.data.lastName;
    }

    set lastName(val: string | null) {
        if (val) {
            val = val.trim();
            if (val.length > 20)
                throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'last name', 20);
        }
        this.data.lastName = val;
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

    get avatar(): string | null {
        return this.data.avatar && STORAGE_URL + this.data.avatar;
    }

    set avatar(val: string | null) {
        if (val) {
            val = val.trim();
            if (val.length > 100)
                throw new SystemError(MessageError.PARAM_LEN_MAX, 'avatar path', 100);
        }
        this.data.avatar = val;
    }

    get gender(): GenderType | null {
        return this.data.gender;
    }

    set gender(val: GenderType | null) {
        if (val) {
            if (!validator.isEnum(val, GenderType))
                throw new SystemError(MessageError.PARAM_INVALID, 'gender');
        }
        this.data.gender = val;
    }

    get birthday(): Date | null {
        return this.data.birthday;
    }

    set birthday(val: Date | null) {
        if (val) {
            if (!validator.isDate(val))
                throw new SystemError(MessageError.PARAM_INVALID, 'birthday');

            val = new Date(val.getFullYear(), val.getMonth(), val.getDate());
            const now = new Date();
            if (val.getTime() > new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() || now.getFullYear() - val.getFullYear() > 100)
                throw new SystemError(MessageError.PARAM_INVALID, 'birthday');
        }
        this.data.birthday = val;
    }

    get birthdayDisplay(): string | null {
        return this.data.birthday && `${this.data.birthday.getFullYear()}-${this.data.birthday.getMonth() + 1}-${this.data.birthday.getDate()}`;
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

    /* Relationship */

    get role(): Role | null {
        return this.data.role ? new Role(this.data.role) : null;
    }

    /* handlers */

    static validateAvatarFile(file: Express.Multer.File): void {
        const maxSize = 1024 * 100; // 100KB
        const formats = ['jpeg', 'jpg', 'png', 'gif'];

        const format = file.mimetype.replace('image/', '');
        if (!formats.includes(format))
            throw new SystemError(MessageError.PARAM_FORMAT_INVALID, 'avatar file', formats.join(', '));

        if (file.size > maxSize)
            throw new SystemError(MessageError.PARAM_SIZE_MAX, 'avatar file', maxSize / 1024, 'KB');
    }

    static getAvatarPath(id: string, ext: string): string {
        return `images/users/${id}/avatar.${ext}`;
    }
}
