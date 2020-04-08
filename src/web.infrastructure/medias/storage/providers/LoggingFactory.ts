import { IBucketItem, IStorageService } from '../../../../web.core/interfaces/gateways/medias/IStorageService';

export class LoggingFactory implements IStorageService {
    constructor(private dataLogging: boolean) { }

    getBuckets(): Promise<string[]> {
        if (this.dataLogging) console.log('Storage.getBuckets');
        return Promise.resolve(['Logging']);
    }

    getBucketPolicy(bucketName: string): Promise<string> {
        if (this.dataLogging) console.log('Storage.getBucketPolicy', bucketName);
        return Promise.resolve('');
    }

    checkBucketExist(bucketName): Promise<boolean> {
        if (this.dataLogging) console.log('Storage.checkBucketExist', bucketName);
        return Promise.resolve(true);
    }

    createBucket(bucketName: string): Promise<void> {
        if (this.dataLogging) console.log('Storage.createBucket', bucketName);
        return Promise.resolve();
    }

    setBucketPolicy(bucketName: string, policy: string): Promise<void> {
        if (this.dataLogging) console.log('Storage.setBucketPolicy', bucketName, policy);
        return Promise.resolve();
    }

    deleteBucket(bucketName: string): Promise<void> {
        if (this.dataLogging) console.log('Storage.deleteBucket', bucketName);
        return Promise.resolve();
    }

    deleteBucketPolicy(bucketName: string): Promise<void> {
        if (this.dataLogging) console.log('Storage.deleteBucketPolicy', bucketName);
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
        if (this.dataLogging) console.log('Storage.getObjects', bucketName, prefix);
        return Promise.resolve(items);
    }

    upload(bucketName: string, objectName: string, buffer: Buffer): Promise<string> {
        const url = `/${bucketName}/${objectName}`;
        if (this.dataLogging) console.log('Storage.upload', bucketName, objectName, buffer);
        return Promise.resolve(url);
    }

    download(bucketName: string, objectName: string): Promise<Buffer> {
        if (this.dataLogging) console.log('Storage.download', bucketName, objectName);
        return Promise.resolve(Buffer.from('Logging'));
    }

    mapUrl(url: string): string {
        if (this.dataLogging) console.log('Storage.mapUrl', url);
        const link = 'http://localhost' + url;
        return link;
    }
}
