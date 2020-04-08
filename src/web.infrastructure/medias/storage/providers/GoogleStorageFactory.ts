import { IStorageService } from '../../../../web.core/interfaces/gateways/medias/IStorageService';

export class GoogleStorageFactory implements IStorageService {
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
