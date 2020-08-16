import { IStorageProvider } from '../interfaces/IStorageProvider';

export class GoogleStorageFactory implements IStorageProvider {
    getBuckets(): any { }

    getBucketPolicy(): any { }

    checkBucketExist(): any { }

    createBucket(): any { }

    setBucketPolicy(): any { }

    deleteBucket(): any { }

    deleteBucketPolicy(): any { }

    getObjects(): any { }

    upload(): any { }

    download(): any { }

    mapUrl(): any { }
}
