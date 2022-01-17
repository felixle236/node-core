import { Readable } from 'stream';
import { STORAGE_URL } from 'config/Configuration';
import minio from 'minio';
import { IBucketItem } from '../interfaces/IBucketItem';
import { IStorageProvider } from '../interfaces/IStorageProvider';
import { IStorageProviderUploadOption } from '../interfaces/IStorageProviderUploadOption';

export class MinioFactory implements IStorageProvider {
  private readonly _client: minio.Client;

  constructor(
    private readonly _host: string,
    private readonly _port: number,
    private readonly _useSSL: boolean,
    private readonly _accessKey: string,
    private readonly _secretKey: string,
  ) {
    this._client = new minio.Client({
      endPoint: this._host,
      port: this._port,
      useSSL: this._useSSL,
      accessKey: this._accessKey,
      secretKey: this._secretKey,
    });
  }

  getBuckets(): Promise<string[]> {
    return this._client.listBuckets().then((buckets) => (buckets || []).map((bucket) => bucket.name));
  }

  getBucketPolicy(bucketName: string): Promise<string> {
    return this._client.getBucketPolicy(bucketName);
  }

  checkBucketExist(bucketName: string): Promise<boolean> {
    return this._client.bucketExists(bucketName);
  }

  createBucket(bucketName: string): Promise<void> {
    return this._client.makeBucket(bucketName, 'ap-southeast-1');
  }

  setBucketPolicy(bucketName: string, policy: string): Promise<void> {
    return this._client.setBucketPolicy(bucketName, policy);
  }

  deleteBucket(bucketName: string): Promise<void> {
    return this._client.removeBucket(bucketName);
  }

  deleteBucketPolicy(bucketName: string): Promise<void> {
    return this._client.setBucketPolicy(bucketName, '');
  }

  getObjects(bucketName: string, prefix = ''): Promise<IBucketItem[]> {
    return new Promise((resolve, reject) => {
      const items: IBucketItem[] = [];
      const bucketStream = this._client.listObjectsV2(bucketName, prefix);

      bucketStream.on('data', (obj) => {
        items.push({
          name: obj.name,
          prefix: obj.prefix,
          size: obj.size,
          etag: obj.etag,
          lastModified: obj.lastModified,
        });
      });
      bucketStream.on('end', () => {
        resolve(items);
      });
      bucketStream.on('error', (err) => {
        reject(err);
      });
    });
  }

  mapUrl(bucketName: string, urlPath: string): string {
    return `${STORAGE_URL}/${bucketName}/${urlPath}`;
  }

  upload(bucketName: string, objectName: string, stream: string | Readable | Buffer, options?: IStorageProviderUploadOption): Promise<boolean> {
    const metaData = {} as minio.ItemBucketMetadata;
    if (options) {
      if (options.mimetype) {
        metaData['Content-Type'] = options.mimetype;
      }
    }
    return this._client.putObject(bucketName, objectName, stream, metaData).then((result) => !!result);
  }

  download(bucketName: string, objectName: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this._client.getObject(bucketName, objectName, (err, dataStream) => {
        if (err) {
          return reject(err);
        }
        const chunks: Buffer[] = [];

        dataStream.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });
        dataStream.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
        dataStream.on('error', (err) => {
          reject(err);
        });
      });
    });
  }

  delete(bucketName: string, objectName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._client.removeObject(bucketName, objectName, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(true);
      });
    });
  }
}
