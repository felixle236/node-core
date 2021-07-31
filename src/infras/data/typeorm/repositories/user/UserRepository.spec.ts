import { mockSelectQueryBuilder } from '@shared/test/MockTypeORM';
import 'mocha';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { UserRepository } from './UserRepository';
import { UserDb } from '../../entities/user/UserDb';

describe('User repository', () => {
    it('Initialize repository', async () => {
        const sandbox = createSandbox();
        mockSelectQueryBuilder<UserDb>(sandbox);

        // eslint-disable-next-line no-new
        const repository = new UserRepository();
        expect(repository).to.not.eq(null);
        sandbox.restore();
    });
});
