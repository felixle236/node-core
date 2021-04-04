import { Readable } from 'node:stream';

export interface IStorageService {
    createBucket(policy: string): Promise<void>;

    mapUrl(urlPath: string): string;

    upload(urlPath: string, filePath: string): Promise<boolean>;
    upload(urlPath: string, filePath: string, mimetype: string): Promise<boolean>;
    upload(urlPath: string, stream: Readable): Promise<boolean>;
    upload(urlPath: string, stream: Readable, mimetype: string): Promise<boolean>;
    upload(urlPath: string, buffer: Buffer): Promise<boolean>;
    upload(urlPath: string, buffer: Buffer, mimetype: string): Promise<boolean>;

    download(urlPath: string): Promise<Buffer>;

    delete(urlPath: string): Promise<boolean>;
}
