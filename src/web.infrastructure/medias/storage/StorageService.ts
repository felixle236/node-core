import { ENABLE_DATA_LOGGING, MINIO_ACCESS_KEY, MINIO_HOST, MINIO_PORT, MINIO_SECRET_KEY, MINIO_USE_SSL, S3_ACCESS_KEY, S3_REGION, S3_SECRET_KEY, STORAGE_TYPE } from '../../../constants/Environments';
import { IBucketItem, IStorageService } from '../../../web.core/interfaces/gateways/medias/IStorageService';
import { AwsS3Factory } from './providers/AwsS3Factory';
import { GoogleStorageFactory } from './providers/GoogleStorageFactory';
import { LoggingFactory } from './providers/LoggingFactory';
import { MinioFactory } from './providers/MinioFactory';
import { Service } from 'typedi';
import { StorageType } from '../../../constants/Enums';

@Service('storage.service')
export class StorageService {
    private storage: IStorageService;

    constructor() {
        switch (STORAGE_TYPE) {
        case StorageType.MINIO:
            this.storage = new MinioFactory(MINIO_HOST, MINIO_PORT, MINIO_USE_SSL, MINIO_ACCESS_KEY, MINIO_SECRET_KEY);
            break;

        case StorageType.AWS_S3:
            this.storage = new AwsS3Factory(S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY);
            break;

        case StorageType.GOOGLE_STORAGE:
            this.storage = new GoogleStorageFactory();
            break;

        case StorageType.LOGGING:
        default:
            this.storage = new LoggingFactory(ENABLE_DATA_LOGGING);
            break;
        }
    }

    getBuckets(): Promise<string[]> {
        return this.storage.getBuckets();
    }

    getBucketPolicy(bucketName: string): Promise<string> {
        return this.storage.getBucketPolicy(bucketName);
    }

    checkBucketExist(bucketName): Promise<boolean> {
        return this.storage.checkBucketExist(bucketName);
    }

    createBucket(bucketName: string): Promise<void> {
        return this.storage.createBucket(bucketName);
    }

    setBucketPolicy(bucketName: string, policy: string): Promise<void> {
        return this.storage.setBucketPolicy(bucketName, policy);
    }

    deleteBucket(bucketName: string): Promise<void> {
        return this.storage.deleteBucket(bucketName);
    }

    deleteBucketPolicy(bucketName: string): Promise<void> {
        return this.storage.deleteBucketPolicy(bucketName);
    }

    getObjects(bucketName: string, prefix?: string): Promise<IBucketItem[]> {
        return this.storage.getObjects(bucketName, prefix!);
    }

    upload(bucketName: string, objectName: string, buffer: Buffer): Promise<string> {
        return this.storage.upload(bucketName, objectName, buffer);
    }

    download(bucketName: string, objectName: string): Promise<Buffer> {
        return this.storage.download(bucketName, objectName);
    }

    mapUrl(url: string): string {
        return this.storage.mapUrl(url);
    }
}
