import crypto from 'crypto';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { IClient } from '@domain/interfaces/user/IClient';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { addSeconds } from '@utils/datetime';
import { expect } from 'chai';
import { v4 } from 'uuid';
import { Client } from './Client';

describe('Client entity', () => {
    it('Set email with invalid value', () => {
        try {
            const client = new Client();
            client.email = 'client.test@';
        }
        catch (error) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_INVALID, 'email').message);
        }
    });

    it('Set phone with the length greater than 20', () => {
        try {
            let str = '';
            [...Array(5)].forEach(() => {
                str += 'phone';
            });
            const client = new Client();
            client.phone = str;
        }
        catch (error) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'phone', 20).message);
        }
    });

    it('Set address with the length greater than 200', () => {
        try {
            let str = '';
            [...Array(30)].forEach(() => {
                str += 'address';
            });
            const client = new Client();
            client.address = str;
        }
        catch (error) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'address', 200).message);
        }
    });

    it('Set locale with invalid value', () => {
        try {
            const client = new Client();
            client.locale = 'ens';
        }
        catch (error) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_INVALID, 'locale').message);
        }
    });

    it('Set active key with the length not equal 64', () => {
        try {
            const client = new Client();
            client.activeKey = 'active key';
        }
        catch (error) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_LEN_EQUAL, 'active key', 64).message);
        }
    });

    it('Get data from entity', () => {
        const dataTest = {
            id: v4(),
            email: 'client.test@localhost.com',
            phone: '0123456789',
            address: '123 Abc',
            locale: 'en-US',
            status: ClientStatus.Actived,
            activeKey: crypto.randomBytes(32).toString('hex'),
            activeExpire: addSeconds(new Date(), 3 * 24 * 60 * 60),
            activedAt: new Date(),
            archivedAt: new Date()
        } as IClient;
        const testEntity = new Client(dataTest);
        const data = testEntity.toData();

        expect(data.id).to.eq(testEntity.id);
        expect(data.email).to.eq(testEntity.email);
        expect(data.phone).to.eq(testEntity.phone);
        expect(data.address).to.eq(testEntity.address);
        expect(data.locale).to.eq(testEntity.locale);
        expect(data.status).to.eq(testEntity.status);
        expect(data.activeKey).to.eq(testEntity.activeKey);
        expect(data.activeExpire?.getTime()).to.eq(testEntity.activeExpire?.getTime());
        expect(data.activedAt?.getTime()).to.eq(testEntity.activedAt?.getTime());
        expect(data.archivedAt?.getTime()).to.eq(testEntity.archivedAt?.getTime());
    });
});
