/* eslint-disable @typescript-eslint/no-empty-function */
import { IAuthJwtService } from '@gateways/services/IAuthJwtService';

export const mockAuthJwtService = (): IAuthJwtService => {
    return {
        getTokenFromHeader() {},
        sign() {},
        verify() {}
    } as any;
};
