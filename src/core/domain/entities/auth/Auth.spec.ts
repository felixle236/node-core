import crypto, { randomUUID } from 'crypto';
import { AuthType } from '@domain/enums/auth/AuthType';
import { IAuth } from '@domain/interfaces/auth/IAuth';
import { IUser } from '@domain/interfaces/user/IUser';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { hashMD5 } from '@utils/crypt';
import { addSeconds } from '@utils/datetime';
import { expect } from 'chai';
import { Auth } from './Auth';
import { User } from '../user/User';

describe('Authorization entity', () => {
    it('Set user id with invalid value', done => {
        try {
            const auth = new Auth();
            auth.userId = 'id';
        }
        catch (error: any) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_INVALID, 'user').message);
            done();
        }
    });

    it('Set username with the length less than 6', done => {
        try {
            const auth = new Auth();
            auth.username = 'user';
        }
        catch (error: any) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_LEN_GREATER_OR_EQUAL, 'username', 6).message);
            done();
        }
    });

    it('Set username with the length greater than 120', done => {
        try {
            let str = '';
            [...Array(20)].forEach(() => {
                str += 'username';
            });
            const auth = new Auth();
            auth.username = str;
        }
        catch (error: any) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'username', 120).message);
            done();
        }
    });

    it('Set password with the length less than 6', done => {
        try {
            const auth = new Auth();
            auth.password = 'Us@1';
        }
        catch (error: any) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_LEN_AT_LEAST_AND_MAX_SPECIAL, 'password', 6, 20).message);
            done();
        }
    });

    it('Set password with the length greater than 20', done => {
        try {
            let str = '';
            [...Array(5)].forEach(() => {
                str += 'P@ssw0rd';
            });
            const auth = new Auth();
            auth.password = str;
        }
        catch (error: any) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_LEN_AT_LEAST_AND_MAX_SPECIAL, 'password', 6, 20).message);
            done();
        }
    });

    it('Set password with easy words', done => {
        try {
            const auth = new Auth();
            auth.password = 'password123';
        }
        catch (error: any) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_LEN_AT_LEAST_AND_MAX_SPECIAL, 'password', 6, 20).message);
            done();
        }
    });

    it('Set forgot key with the length not equal 64', done => {
        try {
            const auth = new Auth();
            auth.forgotKey = 'forgot key';
        }
        catch (error: any) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_LEN_EQUAL, 'forgot key', 64).message);
            done();
        }
    });

    it('Get data from entity', () => {
        const dataTest = {
            id: randomUUID(),
            userId: randomUUID(),
            type: AuthType.PersonalEmail,
            username: 'user.test@gmail.com',
            password: hashMD5('Nodecore@2', '$$'),
            forgotKey: crypto.randomBytes(32).toString('hex'),
            forgotExpire: addSeconds(new Date(), 3 * 24 * 60 * 60),
            user: new User({ id: randomUUID() } as IUser).toData()
        } as IAuth;
        const testEntity = new Auth(dataTest);
        const data = testEntity.toData();

        expect(data.id).to.eq(testEntity.id);
        expect(data.userId).to.eq(testEntity.userId);
        expect(data.type).to.eq(testEntity.type);
        expect(data.username).to.eq(testEntity.username);
        expect(data.password).to.eq(testEntity.password);
        expect(data.forgotKey).to.eq(testEntity.forgotKey);
        expect(data.user?.id).to.eq(testEntity.user?.id);
    });
});
