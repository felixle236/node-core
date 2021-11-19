import 'mocha';
import { expect } from 'chai';
import { mockSelectQueryBuilder } from 'shared/test/MockTypeORM';
import { createSandbox } from 'sinon';
import { UserRepository } from './UserRepository';
import { UserDb } from '../../entities/user/UserDb';

describe('User repository', () => {
    it('Initialize repository', async () => {
        const sandbox = createSandbox();
        mockSelectQueryBuilder<UserDb>(sandbox);

        const repository = new UserRepository();
        expect(!!repository).to.eq(true);
        sandbox.restore();
    });
});
