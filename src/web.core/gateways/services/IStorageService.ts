import { Readable } from 'node:stream';

export interface IStorageUploadOption {
    mimetype: string | null;
    size: number | null;
}

export interface IStorageService {
    createBucket(policy: string): Promise<void>;

    mapUrl(urlPath: string): string;

    upload(urlPath: string, filePath: string): Promise<boolean>;
    upload(urlPath: string, filePath: string, options: IStorageUploadOption): Promise<boolean>;
    upload(urlPath: string, stream: Readable): Promise<boolean>;
    upload(urlPath: string, stream: Readable, options: IStorageUploadOption): Promise<boolean>;
    upload(urlPath: string, buffer: Buffer): Promise<boolean>;
    upload(urlPath: string, buffer: Buffer, options: IStorageUploadOption): Promise<boolean>;

    download(urlPath: string): Promise<Buffer>;

    delete(urlPath: string): Promise<boolean>;
}
