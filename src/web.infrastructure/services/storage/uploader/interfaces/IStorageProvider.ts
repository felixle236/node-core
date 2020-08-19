import { IBucketItem } from './IBucketItem';

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

    upload(bucketName: string, objectName: string, buffer: Buffer): Promise<boolean>;

    download(bucketName: string, objectName: string): Promise<Buffer>;

    mapUrl(bucketName: string, path: string): string;
}
