import { RoleId } from '@domain/enums/user/RoleId';
import { IUser } from '@domain/interfaces/user/IUser';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { isDateString, isEnum, isUUID } from 'class-validator';
import { Container } from 'typedi';
import { IStorageService } from '../../../gateways/services/IStorageService';
import { GenderType } from '../../enums/user/GenderType';
import { Auth } from '../auth/Auth';
import { BaseEntity } from '../base/BaseEntity';

export class UserBase<T extends IUser> extends BaseEntity<string, T> implements IUser {
    get roleId(): string {
        return this.data.roleId;
    }

    set roleId(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'role');

        if (!isUUID(val) || !isEnum(val, RoleId))
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
        if (!this.data.avatar)
            return null;
        const storageService = Container.get<IStorageService>('storage.service');
        return storageService.mapUrl(this.data.avatar);
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
            if (!isEnum(val, GenderType))
                throw new SystemError(MessageError.PARAM_INVALID, 'gender');
        }
        this.data.gender = val;
    }

    get birthday(): string | null {
        return this.data.birthday;
    }

    set birthday(val: string | null) {
        if (val) {
            if (!isDateString(val))
                throw new SystemError(MessageError.PARAM_INVALID, 'birthday');

            if (new Date(val) > new Date())
                throw new SystemError(MessageError.PARAM_INVALID, 'birthday');
        }
        this.data.birthday = val;
    }

    /* Relationship */

    get auths(): Auth[] | null {
        return this.data.auths ? this.data.auths.map(auth => new Auth(auth)) : null;
    }

    /* Handlers */

    static validateAvatarFile(file: Express.Multer.File): void {
        const maxSize = 100 * 1024; // 100KB
        const formats = ['jpeg', 'jpg', 'png', 'gif'];

        const format = file.mimetype.replace('image/', '');
        if (!formats.includes(format))
            throw new SystemError(MessageError.PARAM_FORMAT_INVALID, 'avatar', formats.join(', '));

        if (file.size > maxSize)
            throw new SystemError(MessageError.PARAM_SIZE_MAX, 'avatar', maxSize / 1024, 'KB');
    }

    static getAvatarPath(id: string, ext: string): string {
        return `users/${id}/images/avatar.${ext}`;
    }
}

export class User extends UserBase<IUser> {}
