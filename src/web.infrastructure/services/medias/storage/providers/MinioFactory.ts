import * as minio from 'minio';
import { IBucketItem, IStorageService } from '../../../../../web.core/usecase/boundaries/services/IStorageService';

export class MinioFactory implements IStorageService {
    private readonly _minioClient: minio.Client;

    constructor(
        private readonly _host: string,
        private readonly _port: number,
        private readonly _useSSL: boolean,
        private readonly _accessKey: string,
        private readonly _secretKey: string
    ) {
        this._minioClient = new minio.Client({
            endPoint: this._host,
            port: this._port,
            useSSL: this._useSSL,
            accessKey: this._accessKey,
            secretKey: this._secretKey
        });
    }

    getBuckets(): Promise<string[]> {
        return this._minioClient.listBuckets().then(buckets => (buckets || []).map(bucket => bucket.name));
    }

    getBucketPolicy(bucketName: string): Promise<string> {
        return this._minioClient.getBucketPolicy(bucketName);
    }

    checkBucketExist(bucketName: string): Promise<boolean> {
        return this._minioClient.bucketExists(bucketName);
    }

    createBucket(bucketName: string): Promise<void> {
        return this._minioClient.makeBucket(bucketName, 'ap-southeast-1');
    }

    setBucketPolicy(bucketName: string, policy: string): Promise<void> {
        return this._minioClient.setBucketPolicy(bucketName, policy);
    }

    deleteBucket(bucketName: string): Promise<void> {
        return this._minioClient.removeBucket(bucketName);
    }

    deleteBucketPolicy(bucketName: string): Promise<void> {
        return this._minioClient.setBucketPolicy(bucketName, '');
    }

    getObjects(bucketName: string, prefix?: string): Promise<IBucketItem[]> {
        return new Promise((resolve, reject) => {
            const items: IBucketItem[] = [];
            const bucketStream = this._minioClient.listObjectsV2(bucketName, prefix);

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
        return this._minioClient.putObject(bucketName, objectName, buffer).then(() => {
            return `/${bucketName}/${objectName}`;
        });
    }

    download(bucketName: string, objectName: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            this._minioClient.getObject(bucketName, objectName, (err, dataStream) => {
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
        return (this._useSSL ? 'https' : 'http') + `://${this._host}` + (this._port === 80 ? '' : `:${this._port}`) + url;
    }
}
