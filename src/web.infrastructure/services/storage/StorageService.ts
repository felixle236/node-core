import { BUCKET_NAME } from '../../../configs/Configuration';
import { IStorageService } from '../../../web.core/gateways/services/IStorageService';
import { Service } from 'typedi';
import { StorageUploader } from './uploader/StorageUploader';

@Service('storage.service')
export class StorageService implements IStorageService {
    private readonly _uploader: StorageUploader;

    constructor() {
        this._uploader = new StorageUploader();
    }

    async createBucket(policy: string): Promise<void> {
        const isExist = await this._uploader.checkBucketExist(BUCKET_NAME);
        if (!isExist) {
            await this._uploader.createBucket(BUCKET_NAME);
            await this._uploader.setBucketPolicy(BUCKET_NAME, policy);
        }
    }

    async upload(urlPath: string, buffer: Buffer): Promise<string> {
        return await this._uploader.upload(BUCKET_NAME, urlPath, buffer);
    }

    async download(urlPath: string): Promise<Buffer> {
        return await this._uploader.download(BUCKET_NAME, urlPath);
    }

    mapUrl(urlPath: string): string {
        return this._uploader.mapUrl(urlPath);
    }
}
