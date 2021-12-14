import 'mocha';
import { expect } from 'chai';
import { hashMD5 } from './Crypt';

describe('Utils - Crypt', () => {
    it('Hash md5', () => {
        const data = hashMD5('Nodecore@2', '88');

        expect(data).to.eq('d9533fd414f540aa444e604cca9362a2');
    });

    it('Hash md5 with empty value', () => {
        const data = hashMD5('');

        expect(data).to.eq('');
    });
});
