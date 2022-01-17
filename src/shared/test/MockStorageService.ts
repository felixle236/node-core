import { IStorageService } from 'application/interfaces/services/IStorageService';

export const mockStorageService = (): IStorageService => {
  return {
    async createBucket() {
      return undefined;
    },
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
    },
  };
};
