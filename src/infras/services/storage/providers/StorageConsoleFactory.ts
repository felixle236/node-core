import { Readable } from 'stream';
import { ILogService } from 'application/interfaces/services/ILogService';
import { STORAGE_URL } from 'config/Configuration';
import { InjectService } from 'shared/types/Injection';
import Container from 'typedi';
import { IBucketItem } from '../interfaces/IBucketItem';
import { IStorageProvider } from '../interfaces/IStorageProvider';
import { IStorageProviderUploadOption } from '../interfaces/IStorageProviderUploadOption';

export class StorageConsoleFactory implements IStorageProvider {
    private readonly _logService = Container.get<ILogService>(InjectService.Log);

    async getBuckets(): Promise<string[]> {
        this._logService.info('StorageService.getBuckets');
        return [];
    }

    async getBucketPolicy(bucketName: string): Promise<string> {
        this._logService.info('StorageService.getBucketPolicy', bucketName);
        return '';
    }

    async checkBucketExist(bucketName: string): Promise<boolean> {
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

    async getObjects(bucketName: string, prefix = ''): Promise<IBucketItem[]> {
        this._logService.info('StorageService.getObjects', { bucketName, prefix });
        return [];
    }

    mapUrl(bucketName: string, urlPath: string): string {
        return `${STORAGE_URL}/${bucketName}/${urlPath}`;
    }

    async upload(bucketName: string, objectName: string, _stream: string | Readable | Buffer, options?: IStorageProviderUploadOption): Promise<boolean> {
        this._logService.info('StorageService.upload', { bucketName, objectName, options });
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
