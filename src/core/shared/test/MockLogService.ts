/* eslint-disable @typescript-eslint/no-empty-function */
import { ILogService } from '@gateways/services/ILogService';

export const mockLogService = (): ILogService => {
    return {
        info() {},
        debug() {},
        warn() {},
        error() {},
        createMiddleware(): any {}
    };
};
