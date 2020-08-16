import { BUCKET_NAME } from '../../../constants/Environments';
import { IStorageService } from '../../../web.core/gateways/services/IStorageService';
import { Service } from 'typedi';
import { StorageUploader } from './uploader/StorageUploader';

@Service('storage.service')
export class StorageService implements IStorageService {
    private readonly _uploader: StorageUploader;

    constructor() {
        this._uploader = new StorageUploader();
    }

    upload(urlPath: string, buffer: Buffer): Promise<string> {
        return this._uploader.upload(BUCKET_NAME, urlPath, buffer);
    }

    download(urlPath: string): Promise<Buffer> {
        return this._uploader.download(BUCKET_NAME, urlPath);
    }

    mapUrl(urlPath: string): string {
        return this._uploader.mapUrl(urlPath);
    }
}
