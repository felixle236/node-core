import { Readable } from 'stream';
import { SaveOptions, Storage } from '@google-cloud/storage';
import { GOOGLE_STORAGE_CLASS, GOOGLE_STORAGE_LOCATION, STORAGE_URL } from 'config/Configuration';
import { IStorageProvider } from '../interfaces/IStorageProvider';
import { IStorageProviderUploadOption } from '../interfaces/IStorageProviderUploadOption';

export class GoogleStorageFactory implements IStorageProvider {
  private readonly _storage: Storage;

  constructor() {
    this._storage = new Storage();
  }

  async getBuckets(): Promise<string[]> {
    const [buckets] = await this._storage.getBuckets();
    return buckets.map((bucket) => bucket.name);
  }

  async getBucketPolicy(bucketName: string): Promise<any> {
    const bucket = this._storage.bucket(bucketName);
    const [policy] = await bucket.iam.getPolicy({ requestedPolicyVersion: 3 });
    return policy;
  }

  async checkBucketExist(bucketName: string): Promise<boolean> {
    const bucket = this._storage.bucket(bucketName);
    return !!bucket;
  }

  async createBucket(bucketName: string): Promise<void> {
    await this._storage.createBucket(bucketName, {
      location: GOOGLE_STORAGE_LOCATION && 'ASIA',
      storageClass: GOOGLE_STORAGE_CLASS && 'STANDARD',
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async setBucketPolicy(bucketName: string, policy: any): Promise<void> {
    const bucket = this._storage.bucket(bucketName);
    await bucket.iam.setPolicy(policy);
  }

  async deleteBucket(bucketName: string): Promise<void> {
    await this._storage.bucket(bucketName).delete();
  }

  async deleteBucketPolicy(bucketName: string): Promise<void> {
    const bucket = this._storage.bucket(bucketName);
    const [policy] = await bucket.iam.getPolicy({ requestedPolicyVersion: 3 });
    if (policy) {
      policy.bindings = [];
      await bucket.iam.setPolicy(policy);
    }
  }

  async getObjects(bucketName: string): Promise<any[]> {
    const [files] = await this._storage.bucket(bucketName).getFiles();
    return files;
  }

  mapUrl(bucketName: string, urlPath: string): string {
    return `${STORAGE_URL}/${bucketName}/${urlPath}`;
  }

  async upload(
    bucketName: string,
    objectName: string,
    stream: string | Readable | Buffer,
    options?: IStorageProviderUploadOption,
  ): Promise<any> {
    const file = this._storage.bucket(bucketName).file(objectName);
    const param = {} as SaveOptions;
    if (options) {
      if (options.mimetype) {
        param.contentType = options.mimetype;
      }
    }
    await file.save(stream as any, param);
  }

  async download(bucketName: string, objectName: string): Promise<Buffer> {
    const [data] = await this._storage.bucket(bucketName).file(objectName).download();
    return data;
  }

  async delete(bucketName: string, objectName: string): Promise<boolean> {
    await this._storage.bucket(bucketName).file(objectName).delete();
    return true;
  }
}
