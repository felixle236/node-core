/* eslint-disable @typescript-eslint/no-empty-function */
import { Socket } from 'socket.io';

const emit = (_event: string, _data: any): boolean => true;

export const mockSocket = (): Socket => {
    return {
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
};
