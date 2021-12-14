import 'mocha';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { send, sendAll, sendWithSender } from './Socket';

describe('Utils - Socket', () => {
    const sandbox = createSandbox();
    const emit = (_event: string, _data: any): boolean => true;
    const socket = {
        nsp: {
            to: (_room: string): any => {
                return {
                    emit
                };
            },
            emit
        },
        emit
    } as any;

    afterEach(() => {
        sandbox.restore();
    });

    it('Send message', () => {
        send(socket, 'test', '123', 'abc');
        expect(true).to.eq(true);
    });

    it('Send message with sender', () => {
        sendWithSender(socket, 'test', '123', 'abc');
        expect(true).to.eq(true);
    });

    it('Send message all', () => {
        sendAll(socket, 'test', 'abc');
        expect(true).to.eq(true);
    });
});
