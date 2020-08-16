export interface IStorageService {
    createBucket(policy: string): Promise<void>;

    upload(urlPath: string, buffer: Buffer): Promise<string>;

    download(urlPath: string): Promise<Buffer>;

    mapUrl(urlPath: string): string;
}
