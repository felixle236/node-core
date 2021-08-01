/* eslint-disable @typescript-eslint/no-empty-function */
import { IStorageService } from '@gateways/services/IStorageService';

export const mockStorageService = (): IStorageService => {
    return {
        async createBucket() {},
        mapUrl(path) {
            return path;
        },
        async upload() {
            return true;
        },
        async download() {
            return Buffer.from('test');
        },
        async delete() {
            return true;
        }
    };
};
