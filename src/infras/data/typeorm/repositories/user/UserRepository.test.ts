import 'mocha';
import { expect } from 'chai';
import { UserDb } from '../../entities/user/UserDb';

describe('User repository', () => {
    it('Load entity defination', async () => {
        const data = new UserDb();
        const result = data.toEntity();
        expect(data.fromEntity(result)).to.not.eq(null);
    });
});
