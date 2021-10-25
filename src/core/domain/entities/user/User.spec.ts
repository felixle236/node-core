import { randomUUID } from 'crypto';
import path from 'path';
import { GenderType } from '@domain/enums/user/GenderType';
import { RoleId } from '@domain/enums/user/RoleId';
import { IAuth } from '@domain/interfaces/auth/IAuth';
import { IUser } from '@domain/interfaces/user/IUser';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { mockStorageService } from '@shared/test/MockStorageService';
import { addDays } from '@utils/datetime';
import * as fileLib from '@utils/file';
import { expect } from 'chai';
import mime from 'mime-types';
import Container from 'typedi';
import { User } from './User';

describe('User entity', () => {
    before(() => {
        Container.set('storage.service', mockStorageService());
    });

    it('Set birthday with invalid value', done => {
        try {
            const user = new User();
            user.birthday = 'birthday';
        }
        catch (error: any) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_INVALID, { t: 'birthday' }).message);
            done();
        }
    });

    it('Set birthday with invalid value by date greater than now', done => {
        try {
            const date = addDays(new Date(), 1);
            const user = new User();
            user.birthday = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        }
        catch (error: any) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_INVALID, { t: 'birthday' }).message);
            done();
        }
    });

    it('Get data from entity', () => {
        const dataTest = {
            id: randomUUID(),
            roleId: RoleId.Client,
            firstName: 'user',
            lastName: 'test',
            avatar: 'avatar',
            gender: GenderType.Male,
            birthday: '1970-01-01',
            auths: [{ id: randomUUID() } as IAuth]
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

    it('Validate avatar file is failed by not support file format', done => {
        const filePath = path.join(__dirname, '../../../../resources/images/test/workplace.tiff');
        fileLib.readFile(filePath).then(buffer => {
            const file = {
                mimetype: mime.lookup('tiff'),
                size: buffer.length,
                buffer
            } as Express.Multer.File;

            User.validateAvatarFile(file);
        }).catch(error => {
            const formats = ['jpeg', 'jpg', 'png', 'gif'];
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_FORMAT_INVALID, { t: 'avatar' }, formats.join(', ')).message);
            done();
        });
    });

    it('Validate avatar file is failed by file size greater than 100KB', done => {
        const filePath = path.join(__dirname, '../../../../resources/images/test/test-large-size.png');
        fileLib.readFile(filePath).then(buffer => {
            const file = {
                mimetype: mime.lookup('png'),
                size: buffer.length,
                buffer
            } as Express.Multer.File;

            User.validateAvatarFile(file);
        }).catch(error => {
            const maxSize = 100 * 1024; // 100KB
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_SIZE_MAX, { t: 'avatar' }, maxSize / 1024, 'KB').message);
            done();
        });
    });
});
