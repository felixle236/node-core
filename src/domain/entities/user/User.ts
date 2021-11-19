import { Entity } from 'domain/common/Entity';
import { GenderType } from 'domain/enums/user/GenderType';
import { AddressInfo } from 'domain/value-objects/AddressInfo';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { SystemError } from 'shared/exceptions/SystemError';
import { Auth } from '../auth/Auth';

export class User extends Entity {
    roleId: string;
    firstName: string;
    lastName?: string;
    avatar?: string;
    gender?: GenderType;
    birthday?: string;
    address?: AddressInfo;

    /* Relationship */

    auths?: Auth[];

    /* Handlers */

    static validateAvatarFile(file: Express.Multer.File): void {
        const maxSize = 100 * 1024; // 100KB
        const formats = ['jpeg', 'jpg', 'png', 'gif'];

        const format = file.mimetype.replace('image/', '');
        if (!formats.includes(format))
            throw new SystemError(MessageError.PARAM_FORMAT_INVALID, { t: 'avatar' }, formats.join(', '));

        if (file.size > maxSize)
            throw new SystemError(MessageError.PARAM_SIZE_MAX, { t: 'avatar' }, maxSize / 1024, 'KB');
    }
}
