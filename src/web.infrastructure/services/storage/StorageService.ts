import { Readable } from 'node:stream';
import { Service } from 'typedi';
import { IStorageProvider } from './interfaces/IStorageProvider';
import { AwsS3Factory } from './providers/AwsS3Factory';
import { GoogleStorageFactory } from './providers/GoogleStorageFactory';
import { MinioFactory } from './providers/MinioFactory';
import { StorageConsoleFactory } from './providers/StorageConsoleFactory';
import { BUCKET_NAME, IS_USE_SSL_MINIO, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, S3_ACCESS_KEY, S3_REGION, S3_SECRET_KEY, STORAGE_CONFIG_HOST, STORAGE_CONFIG_PORT, STORAGE_PROVIDER } from '../../../configs/Configuration';
import { StorageProvider } from '../../../configs/ServiceProvider';
import { IStorageService } from '../../../web.core/gateways/services/IStorageService';

@Service('storage.service')
export class StorageService implements IStorageService {
    private readonly _provider: IStorageProvider;

    constructor() {
        switch (STORAGE_PROVIDER) {
        case StorageProvider.MINIO:
            this._provider = new MinioFactory(STORAGE_CONFIG_HOST, STORAGE_CONFIG_PORT, IS_USE_SSL_MINIO, MINIO_ACCESS_KEY, MINIO_SECRET_KEY);
            break;

        case StorageProvider.AWS_S3:
            this._provider = new AwsS3Factory(S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY);
            break;

        case StorageProvider.GOOGLE_STORAGE:
            this._provider = new GoogleStorageFactory();
            break;

        case StorageProvider.CONSOLE:
        default:
            this._provider = new StorageConsoleFactory();
            break;
        }
    }

    async createBucket(policy: string): Promise<void> {
        const isExist = await this._provider.checkBucketExist(BUCKET_NAME);
        if (!isExist) {
            await this._provider.createBucket(BUCKET_NAME);
            await this._provider.setBucketPolicy(BUCKET_NAME, policy);
        }
    }

    mapUrl(urlPath: string): string {
        return this._provider.mapUrl(BUCKET_NAME, urlPath);
    }

    async upload(urlPath: string, stream: string | Readable | Buffer, mimetype?: string): Promise<boolean> {
        return await this._provider.upload(BUCKET_NAME, urlPath, stream as any, mimetype as any);
    }

    async download(urlPath: string): Promise<Buffer> {
        return await this._provider.download(BUCKET_NAME, urlPath);
    }

    async delete(urlPath: string): Promise<boolean> {
        return await this._provider.delete(BUCKET_NAME, urlPath);
    }
}
