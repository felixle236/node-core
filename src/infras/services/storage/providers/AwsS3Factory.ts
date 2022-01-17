/* eslint-disable @typescript-eslint/naming-convention */
import fs from 'fs';
import { Readable } from 'stream';
import S3 from 'aws-sdk/clients/s3';
import { STORAGE_URL } from 'config/Configuration';
import { IBucketItem } from '../interfaces/IBucketItem';
import { IStorageProvider } from '../interfaces/IStorageProvider';
import { IStorageProviderUploadOption } from '../interfaces/IStorageProviderUploadOption';

export class AwsS3Factory implements IStorageProvider {
  private readonly _client: S3;

  constructor(region: string, accessKeyId: string, secretAccessKey: string) {
    this._client = new S3({
      region,
      accessKeyId,
      secretAccessKey,
    });
  }

  getBuckets(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this._client.listBuckets((err, data) => {
        if (err) {
          return reject(err);
        }

        const bucketNames = (data.Buckets || []).map((bucket) => bucket.Name || '');
        resolve(bucketNames);
      });
    });
  }

  getBucketPolicy(bucketName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this._client.getBucketPolicy(
        {
          Bucket: bucketName,
        },
        (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(data.Policy ?? '');
        },
      );
    });
  }

  checkBucketExist(bucketName: string): Promise<boolean> {
    return this.getBuckets().then((buckets) => buckets.includes(bucketName));
  }

  createBucket(bucketName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._client.createBucket(
        {
          Bucket: bucketName,
        },
        (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        },
      );
    });
  }

  setBucketPolicy(bucketName: string, policy: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._client.putBucketPolicy(
        {
          Bucket: bucketName,
          Policy: policy,
        },
        (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        },
      );
    });
  }

  deleteBucket(bucketName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._client.deleteBucket(
        {
          Bucket: bucketName,
        },
        (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        },
      );
    });
  }

  deleteBucketPolicy(bucketName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._client.deleteBucketPolicy(
        {
          Bucket: bucketName,
        },
        (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        },
      );
    });
  }

  getObjects(bucketName: string, prefix = ''): Promise<IBucketItem[]> {
    return new Promise<IBucketItem[]>((resolve, reject) => {
      const items: IBucketItem[] = [];
      this._client.listObjectsV2(
        {
          Bucket: bucketName,
          Prefix: prefix,
        },
        (err, data) => {
          if (err) {
            return reject(err);
          }

          (data.Contents || []).forEach((obj) => {
            items.push({
              name: obj.Key || '',
              prefix: prefix || '',
              size: obj.Size || 0,
              etag: obj.ETag || '',
              lastModified: obj.LastModified || new Date(),
            });
          });
          resolve(items);
        },
      );
    });
  }

  mapUrl(bucketName: string, urlPath: string): string {
    return `${STORAGE_URL}/${bucketName}/${urlPath}`;
  }

  upload(
    bucketName: string,
    objectName: string,
    stream: string | Readable | Buffer,
    options?: IStorageProviderUploadOption,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (typeof stream === 'string') {
        stream = fs.createReadStream(stream);
      }

      const param = {
        Bucket: bucketName,
        Key: objectName,
        Body: stream,
      } as S3.PutObjectRequest;

      if (options) {
        if (options.mimetype) {
          param.ContentType = options.mimetype;
        }
        if (options.size) {
          param.ContentLength = options.size;
        }
      }
      this._client.upload(param, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(true);
      });
    });
  }

  download(bucketName: string, objectName: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this._client.getObject(
        {
          Bucket: bucketName,
          Key: objectName,
        },
        (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(<Buffer>data.Body);
        },
      );
    });
  }

  delete(bucketName: string, objectName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._client.deleteObject(
        {
          Bucket: bucketName,
          Key: objectName,
        },
        (err) => {
          if (err) {
            return reject(err);
          }
          resolve(true);
        },
      );
    });
  }
}
