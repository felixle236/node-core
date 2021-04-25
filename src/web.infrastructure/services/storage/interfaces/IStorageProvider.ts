import { Readable } from 'node:stream';
import { IBucketItem } from './IBucketItem';
import { IStorageProviderUploadOption } from './IStorageProviderUploadOption';

export interface IStorageProvider {
    getBuckets(): Promise<string[]>;

    getBucketPolicy(bucketName: string): Promise<string>;

    checkBucketExist(bucketName): Promise<boolean>;

    createBucket(bucketName: string): Promise<void>;

    setBucketPolicy(bucketName: string, policy: string): Promise<void>;

    deleteBucket(bucketName: string): Promise<void>;

    deleteBucketPolicy(bucketName: string): Promise<void>;

    getObjects(bucketName: string): Promise<IBucketItem[]>;
    getObjects(bucketName: string, prefix?: string): Promise<IBucketItem[]>;

    mapUrl(bucketName: string, urlPath: string): string;

    upload(bucketName: string, objectName: string, filePath: string): Promise<boolean>;
    upload(bucketName: string, objectName: string, filePath: string, options: IStorageProviderUploadOption): Promise<boolean>;
    upload(bucketName: string, objectName: string, stream: Readable): Promise<boolean>;
    upload(bucketName: string, objectName: string, stream: Readable, options: IStorageProviderUploadOption): Promise<boolean>;
    upload(bucketName: string, objectName: string, buffer: Buffer): Promise<boolean>;
    upload(bucketName: string, objectName: string, buffer: Buffer, options: IStorageProviderUploadOption): Promise<boolean>;

    download(bucketName: string, objectName: string): Promise<Buffer>;

    delete(bucketName: string, objectName: string): Promise<boolean>;
}
