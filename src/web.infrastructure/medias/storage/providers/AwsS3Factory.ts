import * as S3 from 'aws-sdk/clients/s3';
import { IBucketItem, IStorageService } from '../../../../web.core/interfaces/gateways/medias/IStorageService';

export class AwsS3Factory implements IStorageService {
    private s3Client: S3;

    constructor(private region: string, private accessKey: string, private secretKey: string) {
        this.s3Client = new S3({
            region: this.region,
            accessKeyId: this.accessKey,
            secretAccessKey: this.secretKey
        });
    }

    getBuckets(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.s3Client.listBuckets((err, data) => {
                if (err) return reject(err);

                const bucketNames = (data.Buckets || []).map(bucket => bucket.Name || '');
                resolve(bucketNames);
            });
        });
    }

    getBucketPolicy(bucketName: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.s3Client.getBucketPolicy({ Bucket: bucketName }, (err, data) => {
                if (err) return reject(err);
                resolve(data.Policy);
            });
        });
    }

    checkBucketExist(bucketName): Promise<boolean> {
        return this.getBuckets().then(buckets => buckets.includes(bucketName));
    }

    createBucket(bucketName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.s3Client.createBucket({ Bucket: bucketName }, err => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    setBucketPolicy(bucketName: string, policy: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.s3Client.putBucketPolicy({ Bucket: bucketName, Policy: policy }, err => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    deleteBucket(bucketName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.s3Client.deleteBucket({ Bucket: bucketName }, err => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    deleteBucketPolicy(bucketName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.s3Client.deleteBucketPolicy({ Bucket: bucketName }, err => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    getObjects(bucketName: string, prefix?: string): Promise<IBucketItem[]> {
        return new Promise<IBucketItem[]>((resolve, reject) => {
            const items: IBucketItem[] = [];
            this.s3Client.listObjectsV2({
                Bucket: bucketName,
                Prefix: prefix
            }, (err, data) => {
                if (err) return reject(err);

                (data.Contents || []).forEach(obj => {
                    items.push({
                        name: obj.Key || '',
                        prefix: prefix || '',
                        size: obj.Size || 0,
                        etag: obj.ETag || '',
                        lastModified: obj.LastModified || new Date()
                    });
                });
                resolve(items);
            });
        });
    }

    upload(bucketName: string, objectName: string, buffer: Buffer): Promise<string> {
        return new Promise((resolve, reject) => {
            this.s3Client.upload({
                Bucket: bucketName,
                Key: objectName,
                Body: buffer
            }, err => {
                if (err) return reject(err);
                resolve(`/${bucketName}/${objectName}`);
            });
        });
    }

    download(bucketName: string, objectName: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            this.s3Client.getObject({
                Bucket: bucketName,
                Key: objectName
            }, (err, data) => {
                if (err) return reject(err);
                resolve(<Buffer>data.Body);
            });
        });
    }

    mapUrl(url: string): string {
        return `https://s3.${this.region}.amazonaws.com${url}`;
    }
}
