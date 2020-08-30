import { IBucketItem } from '../interfaces/IBucketItem';
import { IStorageProvider } from '../interfaces/IStorageProvider';

export class StorageConsoleFactory implements IStorageProvider {
    async getBuckets(): Promise<string[]> {
        console.log('StorageService.getBuckets');
        return [];
    }

    async getBucketPolicy(bucketName: string): Promise<string> {
        console.log('StorageService.getBucketPolicy', bucketName);
        return '';
    }

    async checkBucketExist(bucketName): Promise<boolean> {
        console.log('StorageService.checkBucketExist', bucketName);
        return true;
    }

    async createBucket(bucketName: string): Promise<void> {
        console.log('StorageService.createBucket', bucketName);
    }

    async setBucketPolicy(bucketName: string, policy: string): Promise<void> {
        console.log('StorageService.setBucketPolicy', { bucketName, policy });
    }

    async deleteBucket(bucketName: string): Promise<void> {
        console.log('StorageService.deleteBucket', bucketName);
    }

    async deleteBucketPolicy(bucketName: string): Promise<void> {
        console.log('StorageService.deleteBucketPolicy', bucketName);
    }

    async getObjects(bucketName: string, prefix?: string): Promise<IBucketItem[]> {
        console.log('StorageService.getObjects', { bucketName, prefix });
        return [];
    }

    async upload(bucketName: string, objectName: string, _buffer: Buffer): Promise<boolean> {
        console.log('StorageService.upload', { bucketName, objectName });
        return true;
    }

    async download(bucketName: string, objectName: string): Promise<Buffer> {
        console.log('StorageService.download', { bucketName, objectName });
        return Promise.resolve(Buffer.from('Logging'));
    }
}
