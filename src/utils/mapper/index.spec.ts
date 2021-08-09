import 'mocha';
import { expect } from 'chai';
import { mapTemplate, mapTemplateWithDataObject } from '.';

describe('Utils - Mapper', () => {
    it('Map template', () => {
        const data = mapTemplate('Test {0} {1}', 'Node', 'Core');

        expect(data).to.eq('Test Node Core');
    });

    it('Map template object', () => {
        const data = mapTemplateWithDataObject('Test {{name}} {{version}}', { name: 'Node core', version: 2 });

        expect(data).to.eq('Test Node core 2');
    });
});
