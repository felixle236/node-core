import { Readable } from 'node:stream';
import Container from 'typedi';
import { STORAGE_URL } from '../../../../configs/Configuration';
import { ILogService } from '../../../../web.core/gateways/services/ILogService';
import { IBucketItem } from '../interfaces/IBucketItem';
import { IStorageProvider } from '../interfaces/IStorageProvider';

export class StorageConsoleFactory implements IStorageProvider {
    private readonly _logService = Container.get<ILogService>('log.service');

    async getBuckets(): Promise<string[]> {
        this._logService.info('StorageService.getBuckets');
        return [];
    }

    async getBucketPolicy(bucketName: string): Promise<string> {
        this._logService.info('StorageService.getBucketPolicy', bucketName);
        return '';
    }

    async checkBucketExist(bucketName): Promise<boolean> {
        this._logService.info('StorageService.checkBucketExist', bucketName);
        return true;
    }

    async createBucket(bucketName: string): Promise<void> {
        this._logService.info('StorageService.createBucket', bucketName);
    }

    async setBucketPolicy(bucketName: string, policy: string): Promise<void> {
        this._logService.info('StorageService.setBucketPolicy', { bucketName, policy });
    }

    async deleteBucket(bucketName: string): Promise<void> {
        this._logService.info('StorageService.deleteBucket', bucketName);
    }

    async deleteBucketPolicy(bucketName: string): Promise<void> {
        this._logService.info('StorageService.deleteBucketPolicy', bucketName);
    }

    async getObjects(bucketName: string, prefix?: string): Promise<IBucketItem[]> {
        this._logService.info('StorageService.getObjects', { bucketName, prefix });
        return [];
    }

    mapUrl(bucketName: string, urlPath: string): string {
        return `${STORAGE_URL}/${bucketName}/${urlPath}`;
    }

    async upload(bucketName: string, objectName: string, _stream: string | Readable | Buffer, mimetype?: string): Promise<boolean> {
        this._logService.info('StorageService.upload', { bucketName, objectName, mimetype });
        return true;
    }

    async download(bucketName: string, objectName: string): Promise<Buffer> {
        this._logService.info('StorageService.download', { bucketName, objectName });
        return Promise.resolve(Buffer.from('Logging'));
    }

    async delete(bucketName: string, objectName: string): Promise<boolean> {
        this._logService.info('StorageService.delete', { bucketName, objectName });
        return true;
    }
}
