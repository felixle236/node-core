import path from 'path';
import { GenderType } from '@domain/enums/user/GenderType';
import { RoleId } from '@domain/enums/user/RoleId';
import { IAuth } from '@domain/interfaces/auth/IAuth';
import { IUser } from '@domain/interfaces/user/IUser';
import { addDays } from '@libs/date';
import * as fileLib from '@libs/file';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { mockStorageService } from '@shared/test/MockStorageService';
import { expect } from 'chai';
import mime from 'mime-types';
import Container from 'typedi';
import { v4 } from 'uuid';
import { User } from './User';

describe('User entity', () => {
    before(() => {
        Container.set('storage.service', mockStorageService());
    });

    it('Set role id with invalid value', () => {
        try {
            const user = new User();
            user.roleId = 'role id';
        }
        catch (error) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_INVALID, 'role').message);
        }
    });

    it('Set role id with invalid value by id not in role id list', () => {
        try {
            const user = new User();
            user.roleId = v4();
        }
        catch (error) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_INVALID, 'role').message);
        }
    });

    it('Set first name with the length greater than 20', () => {
        try {
            let str = '';
            [...Array(3)].forEach(() => {
                str += 'firstName';
            });
            const user = new User();
            user.firstName = str;
        }
        catch (error) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'first name', 20).message);
        }
    });

    it('Set last name with the length greater than 20', () => {
        try {
            let str = '';
            [...Array(3)].forEach(() => {
                str += 'lastName';
            });
            const user = new User();
            user.lastName = str;
        }
        catch (error) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'last name', 20).message);
        }
    });

    it('Set avatar with the length greater than 200', () => {
        try {
            let str = '';
            [...Array(40)].forEach(() => {
                str += 'avatar';
            });
            const user = new User();
            user.avatar = str;
        }
        catch (error) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_LEN_MAX, 'avatar path', 200).message);
        }
    });

    it('Set birthday with invalid value', () => {
        try {
            const user = new User();
            user.birthday = 'birthday';
        }
        catch (error) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_INVALID, 'birthday').message);
        }
    });

    it('Set birthday with invalid value by date greater than now', () => {
        try {
            const date = addDays(new Date(), 1);
            const user = new User();
            user.birthday = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        }
        catch (error) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_INVALID, 'birthday').message);
        }
    });

    it('Get data from entity', () => {
        const dataTest = {
            id: v4(),
            roleId: RoleId.CLIENT,
            firstName: 'user',
            lastName: 'test',
            avatar: 'avatar',
            gender: GenderType.MALE,
            birthday: '1970-01-01',
            auths: [{ id: v4() } as IAuth]
        } as IUser;
        const testEntity = new User(dataTest);
        const data = testEntity.toData();

        expect(data.id).to.eq(testEntity.id);
        expect(data.roleId).to.eq(testEntity.roleId);
        expect(data.firstName).to.eq(testEntity.firstName);
        expect(data.lastName).to.eq(testEntity.lastName);
        expect(data.avatar).to.eq(testEntity.avatar);
        expect(data.gender).to.eq(testEntity.gender);
        expect(data.birthday).to.eq(testEntity.birthday);
        expect(data.auths && data.auths[0].id).to.eq(testEntity.auths && testEntity.auths[0].id);
    });

    it('Validate avatar file is failed by not support file format', async () => {
        try {
            const filePath = path.join(__dirname, '../../../../resources/images/test/workplace.tiff');
            const buffer = await fileLib.readFile(filePath);
            const file = {
                mimetype: mime.lookup('tiff'),
                size: buffer.length,
                buffer
            } as Express.Multer.File;

            User.validateAvatarFile(file);
        }
        catch (error) {
            const formats = ['jpeg', 'jpg', 'png', 'gif'];
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_FORMAT_INVALID, 'avatar', formats.join(', ')).message);
        }
    });

    it('Validate avatar file is failed by file size greater than 100KB', async () => {
        try {
            const filePath = path.join(__dirname, '../../../../resources/images/test/test-large-size.png');
            const buffer = await fileLib.readFile(filePath);
            const file = {
                mimetype: mime.lookup('png'),
                size: buffer.length,
                buffer
            } as Express.Multer.File;

            User.validateAvatarFile(file);
        }
        catch (error) {
            const maxSize = 100 * 1024; // 100KB
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_SIZE_MAX, 'avatar', maxSize / 1024, 'KB').message);
        }
    });
});
