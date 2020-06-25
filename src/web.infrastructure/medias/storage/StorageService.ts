import { IBucketItem, IStorageService } from '../../../web.core/interfaces/gateways/medias/IStorageService';
import { IS_USE_SSL_MINIO, MINIO_ACCESS_KEY, MINIO_CONFIG_HOST, MINIO_CONFIG_PORT, MINIO_SECRET_KEY, S3_ACCESS_KEY, S3_REGION, S3_SECRET_KEY, STORAGE_TYPE } from '../../../constants/Environments';
import { AwsS3Factory } from './providers/AwsS3Factory';
import { GoogleStorageFactory } from './providers/GoogleStorageFactory';
import { LoggingFactory } from './providers/LoggingFactory';
import { MinioFactory } from './providers/MinioFactory';
import { Service } from 'typedi';
import { StorageType } from '../../../constants/Enums';

@Service('storage.service')
export class StorageService implements IStorageService {
    private readonly _storage: IStorageService;

    constructor() {
        switch (STORAGE_TYPE) {
        case StorageType.MINIO:
            this._storage = new MinioFactory(MINIO_CONFIG_HOST, MINIO_CONFIG_PORT, IS_USE_SSL_MINIO, MINIO_ACCESS_KEY, MINIO_SECRET_KEY);
            break;

        case StorageType.AWS_S3:
            this._storage = new AwsS3Factory(S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY);
            break;

        case StorageType.GOOGLE_STORAGE:
            this._storage = new GoogleStorageFactory();
            break;

        case StorageType.LOGGING:
        default:
            this._storage = new LoggingFactory();
            break;
        }
    }

    getBuckets(): Promise<string[]> {
        return this._storage.getBuckets();
    }

    getBucketPolicy(bucketName: string): Promise<string> {
        return this._storage.getBucketPolicy(bucketName);
    }

    checkBucketExist(bucketName): Promise<boolean> {
        return this._storage.checkBucketExist(bucketName);
    }

    createBucket(bucketName: string): Promise<void> {
        return this._storage.createBucket(bucketName);
    }

    setBucketPolicy(bucketName: string, policy: string): Promise<void> {
        return this._storage.setBucketPolicy(bucketName, policy);
    }

    deleteBucket(bucketName: string): Promise<void> {
        return this._storage.deleteBucket(bucketName);
    }

    deleteBucketPolicy(bucketName: string): Promise<void> {
        return this._storage.deleteBucketPolicy(bucketName);
    }

    getObjects(bucketName: string, prefix?: string): Promise<IBucketItem[]> {
        return this._storage.getObjects(bucketName, prefix!);
    }

    upload(bucketName: string, objectName: string, buffer: Buffer): Promise<string> {
        return this._storage.upload(bucketName, objectName, buffer);
    }

    download(bucketName: string, objectName: string): Promise<Buffer> {
        return this._storage.download(bucketName, objectName);
    }

    mapUrl(url: string): string {
        return this._storage.mapUrl(url);
    }
}
