/* eslint-disable @typescript-eslint/no-empty-function */
import { IStorageService } from '@gateways/services/IStorageService';

export const mockStorageService = {
    mapUrl(path) {
        return path;
    }
} as IStorageService;
