/* eslint-disable @typescript-eslint/no-empty-function */
import { ILogService } from '@gateways/services/ILogService';

export const mockLogService = {
    info() {},
    debug() {},
    warn() {},
    error() {},
    createMiddleware(): any {}
} as ILogService;
