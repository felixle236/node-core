import { Readable } from 'stream';
import { MINIO_ACCESS_KEY, MINIO_HOST, MINIO_PORT, MINIO_SECRET_KEY, MINIO_USE_SSL, S3_ACCESS_KEY, S3_REGION, S3_SECRET_KEY, STORAGE_BUCKET_NAME, STORAGE_PROVIDER } from '@configs/Configuration';
import { StorageProvider } from '@configs/Enums';
import { IStorageService, IStorageUploadOption } from '@gateways/services/IStorageService';
import { Service } from 'typedi';
import { IStorageProvider } from './interfaces/IStorageProvider';
import { AwsS3Factory } from './providers/AwsS3Factory';
import { GoogleStorageFactory } from './providers/GoogleStorageFactory';
import { MinioFactory } from './providers/MinioFactory';
import { StorageConsoleFactory } from './providers/StorageConsoleFactory';

@Service('storage.service')
export class StorageService implements IStorageService {
    private readonly _provider: IStorageProvider;

    constructor() {
        switch (STORAGE_PROVIDER) {
        case StorageProvider.MinIO:
            this._provider = new MinioFactory(MINIO_HOST, MINIO_PORT, MINIO_USE_SSL, MINIO_ACCESS_KEY, MINIO_SECRET_KEY);
            break;

        case StorageProvider.AwsS3:
            this._provider = new AwsS3Factory(S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY);
            break;

        case StorageProvider.GoogleStorage:
            this._provider = new GoogleStorageFactory();
            break;

        case StorageProvider.Console:
        default:
            this._provider = new StorageConsoleFactory();
            break;
        }
    }

    async createBucket(policy: string): Promise<void> {
        const isExist = await this._provider.checkBucketExist(STORAGE_BUCKET_NAME);
        if (!isExist) {
            await this._provider.createBucket(STORAGE_BUCKET_NAME);
            await this._provider.setBucketPolicy(STORAGE_BUCKET_NAME, policy);
        }
    }

    mapUrl(urlPath: string): string {
        return this._provider.mapUrl(STORAGE_BUCKET_NAME, urlPath);
    }

    async upload(urlPath: string, stream: string | Readable | Buffer, options?: IStorageUploadOption): Promise<boolean> {
        return await this._provider.upload(STORAGE_BUCKET_NAME, urlPath, stream as any, options as any);
    }

    async download(urlPath: string): Promise<Buffer> {
        return await this._provider.download(STORAGE_BUCKET_NAME, urlPath);
    }

    async delete(urlPath: string): Promise<boolean> {
        return await this._provider.delete(STORAGE_BUCKET_NAME, urlPath);
    }
}
