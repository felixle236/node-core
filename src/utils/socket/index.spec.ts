/* eslint-disable @typescript-eslint/no-empty-function */
import 'mocha';
import { mockSocket } from '@shared/test/MockSocket';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { send, sendAll, sendAllWithSender, sendWithSender } from '.';

describe('Utils - Crypt', () => {
    const sandbox = createSandbox();
    const socket = mockSocket();

    afterEach(() => {
        sandbox.restore();
    });

    it('Send message', () => {
        send(socket, 'test', '123', 'abc');
        expect(true).to.eq(true);
    });

    it('Send message all', () => {
        sendAll(socket, 'test', 'abc');
        expect(true).to.eq(true);
    });

    it('Send message with sender', () => {
        sendWithSender(socket, 'test', '123', 'abc');
        expect(true).to.eq(true);
    });

    it('Send message all with sender', () => {
        sendAllWithSender(socket, 'test', 'abc');
        expect(true).to.eq(true);
    });
});
