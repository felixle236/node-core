import { IS_USE_SSL_MINIO, MINIO_ACCESS_KEY, MINIO_CONFIG_HOST, MINIO_CONFIG_PORT, MINIO_SECRET_KEY, S3_ACCESS_KEY, S3_REGION, S3_SECRET_KEY, STORAGE_PROVIDER } from '../../../../constants/Environments';
import { AwsS3Factory } from './providers/AwsS3Factory';
import { GoogleStorageFactory } from './providers/GoogleStorageFactory';
import { IBucketItem } from './interfaces/IBucketItem';
import { IStorageProvider } from './interfaces/IStorageProvider';
import { MinioFactory } from './providers/MinioFactory';
import { StorageConsoleFactory } from './providers/StorageConsoleFactory';
import { StorageProvider } from '../../../../constants/Enums';

export class StorageUploader implements IStorageProvider {
    private readonly _provider: IStorageProvider;

    constructor() {
        switch (STORAGE_PROVIDER) {
        case StorageProvider.MINIO:
            this._provider = new MinioFactory(MINIO_CONFIG_HOST, MINIO_CONFIG_PORT, IS_USE_SSL_MINIO, MINIO_ACCESS_KEY, MINIO_SECRET_KEY);
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

    async getBuckets(): Promise<string[]> {
        return await this._provider.getBuckets();
    }

    async getBucketPolicy(bucketName: string): Promise<string> {
        return await this._provider.getBucketPolicy(bucketName);
    }

    async checkBucketExist(bucketName: string): Promise<boolean> {
        return await this._provider.checkBucketExist(bucketName);
    }

    async createBucket(bucketName: string): Promise<void> {
        return await this._provider.createBucket(bucketName);
    }

    async setBucketPolicy(bucketName: string, policy: string): Promise<void> {
        return await this._provider.setBucketPolicy(bucketName, policy);
    }

    async deleteBucket(bucketName: string): Promise<void> {
        return await this._provider.deleteBucket(bucketName);
    }

    async deleteBucketPolicy(bucketName: string): Promise<void> {
        return await this._provider.deleteBucketPolicy(bucketName);
    }

    async getObjects(bucketName: string, prefix?: string): Promise<IBucketItem[]> {
        return await this._provider.getObjects(bucketName, prefix);
    }

    async upload(bucketName: string, objectName: string, buffer: Buffer): Promise<string> {
        return await this._provider.upload(bucketName, objectName, buffer);
    }

    async download(bucketName: string, objectName: string): Promise<Buffer> {
        return await this._provider.download(bucketName, objectName);
    }

    mapUrl(path: string): string {
        return this._provider.mapUrl(path);
    }
}
