import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { IManager } from '@domain/interfaces/user/IManager';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { expect } from 'chai';
import { v4 } from 'uuid';
import { Manager } from './Manager';

describe('Manager entity', () => {
    it('Set email with invalid value', () => {
        try {
            const manager = new Manager();
            manager.email = 'manager.test@';
        }
        catch (error) {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_INVALID, 'email').message);
        }
    });

    it('Get data from entity', () => {
        const dataTest = {
            id: v4(),
            email: 'manager.test@localhost.com',
            status: ManagerStatus.Actived,
            archivedAt: new Date()
        } as IManager;
        const testEntity = new Manager(dataTest);
        const data = testEntity.toData();

        expect(data.id).to.eq(testEntity.id);
        expect(data.email).to.eq(testEntity.email);
        expect(data.status).to.eq(testEntity.status);
        expect(data.archivedAt?.getTime()).to.eq(testEntity.archivedAt?.getTime());
    });
});
