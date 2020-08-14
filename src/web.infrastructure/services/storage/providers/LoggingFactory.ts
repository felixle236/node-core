import { IBucketItem, IStorageService } from '../../../../../web.core/gateways/services/IStorageService';
import { ENABLE_DATA_LOGGING } from '../../../../../constants/Environments';

export class LoggingFactory implements IStorageService {
    getBuckets(): Promise<string[]> {
        if (ENABLE_DATA_LOGGING) console.log('Storage.getBuckets');
        return Promise.resolve(['Logging']);
    }

    getBucketPolicy(bucketName: string): Promise<string> {
        if (ENABLE_DATA_LOGGING) console.log('Storage.getBucketPolicy', bucketName);
        return Promise.resolve('');
    }

    checkBucketExist(bucketName): Promise<boolean> {
        if (ENABLE_DATA_LOGGING) console.log('Storage.checkBucketExist', bucketName);
        return Promise.resolve(true);
    }

    createBucket(bucketName: string): Promise<void> {
        if (ENABLE_DATA_LOGGING) console.log('Storage.createBucket', bucketName);
        return Promise.resolve();
    }

    setBucketPolicy(bucketName: string, policy: string): Promise<void> {
        if (ENABLE_DATA_LOGGING) console.log('Storage.setBucketPolicy', bucketName, policy);
        return Promise.resolve();
    }

    deleteBucket(bucketName: string): Promise<void> {
        if (ENABLE_DATA_LOGGING) console.log('Storage.deleteBucket', bucketName);
        return Promise.resolve();
    }

    deleteBucketPolicy(bucketName: string): Promise<void> {
        if (ENABLE_DATA_LOGGING) console.log('Storage.deleteBucketPolicy', bucketName);
        return Promise.resolve();
    }

    getObjects(bucketName: string, prefix?: string): Promise<IBucketItem[]> {
        const items: IBucketItem[] = [];
        items.push({
            name: '',
            prefix: '',
            size: 0,
            etag: '',
            lastModified: new Date()
        });
        if (ENABLE_DATA_LOGGING) console.log('Storage.getObjects', bucketName, prefix);
        return Promise.resolve(items);
    }

    upload(bucketName: string, objectName: string, buffer: Buffer): Promise<string> {
        const url = `/${bucketName}/${objectName}`;
        if (ENABLE_DATA_LOGGING) console.log('Storage.upload', bucketName, objectName, buffer);
        return Promise.resolve(url);
    }

    download(bucketName: string, objectName: string): Promise<Buffer> {
        if (ENABLE_DATA_LOGGING) console.log('Storage.download', bucketName, objectName);
        return Promise.resolve(Buffer.from('Logging'));
    }

    mapUrl(url: string): string {
        if (ENABLE_DATA_LOGGING) console.log('Storage.mapUrl', url);
        const link = 'http://localhost' + url;
        return link;
    }
}
