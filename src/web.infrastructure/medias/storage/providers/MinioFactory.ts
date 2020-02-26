import * as minio from 'minio';
import { IBucketItem, IStorageService } from '../../../../web.core/interfaces/gateways/medias/IStorageService';

export class MinioFactory implements IStorageService {
    private minioClient: minio.Client;

    constructor(private host: string, private port: number, private useSSL: boolean, private accessKey: string, private secretKey: string) {
        this.minioClient = new minio.Client({
            endPoint: this.host,
            port: this.port,
            useSSL: this.useSSL,
            accessKey: this.accessKey,
            secretKey: this.secretKey
        });
    }

    getBuckets(): Promise<string[]> {
        return this.minioClient.listBuckets().then(buckets => (buckets || []).map(bucket => bucket.name));
    }

    getBucketPolicy(bucketName: string): Promise<string> {
        return this.minioClient.getBucketPolicy(bucketName);
    }

    checkBucketExist(bucketName: string): Promise<boolean> {
        return this.minioClient.bucketExists(bucketName);
    }

    createBucket(bucketName: string): Promise<void> {
        return this.minioClient.makeBucket(bucketName, 'ap-southeast-1');
    }

    setBucketPolicy(bucketName: string, policy: string): Promise<void> {
        return this.minioClient.setBucketPolicy(bucketName, policy);
    }

    deleteBucket(bucketName: string): Promise<void> {
        return this.minioClient.removeBucket(bucketName);
    }

    deleteBucketPolicy(bucketName: string): Promise<void> {
        return this.minioClient.setBucketPolicy(bucketName, '');
    }

    getObjects(bucketName: string, prefix?: string): Promise<IBucketItem[]> {
        return new Promise((resolve, reject) => {
            const items: IBucketItem[] = [];
            const bucketStream = this.minioClient.listObjectsV2(bucketName, prefix);

            bucketStream.on('data', obj => {
                items.push({
                    name: obj.name,
                    prefix: obj.prefix,
                    size: obj.size,
                    etag: obj.etag,
                    lastModified: obj.lastModified
                });
            });
            bucketStream.on('end', () => {
                resolve(items);
            });
            bucketStream.on('error', err => {
                reject(err);
            });
        });
    }

    upload(bucketName: string, objectName: string, buffer: Buffer): Promise<string> {
        return this.minioClient.putObject(bucketName, objectName, buffer).then(() => {
            return `/${bucketName}/${objectName}`;
        });
    }

    download(bucketName: string, objectName: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            this.minioClient.getObject(bucketName, objectName, (err, dataStream) => {
                if (err) return reject(err);
                const chunks: Buffer[] = [];

                dataStream.on('data', (chunk: Buffer) => {
                    chunks.push(chunk);
                });
                dataStream.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });
                dataStream.on('error', err => {
                    reject(err);
                });
            });
        });
    }

    mapUrl(url: string): string {
        return (this.useSSL ? 'https' : 'http') + `://${this.host}` + (this.port === 80 ? '' : `:${this.port}`) + url;
    }
}
