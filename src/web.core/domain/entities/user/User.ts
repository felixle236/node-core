import * as validator from 'class-validator';
import { STORAGE_URL } from '../../../../configs/Configuration';
import { MessageError } from '../../common/exceptions/message/MessageError';
import { SystemError } from '../../common/exceptions/SystemError';
import { RoleId } from '../../enums/role/RoleId';
import { GenderType } from '../../enums/user/GenderType';
import { IUser } from '../../types/user/IUser';
import { BaseEntity } from '../base/BaseEntity';
import { Role } from '../role/Role';

export class UserBase<T extends IUser> extends BaseEntity<T> implements IUser {
    constructor(data?: T) {
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

export class User extends UserBase<IUser> {}
