export interface IStorageService {
    createBucket(policy: string): Promise<void>;

    upload(urlPath: string, buffer: Buffer): Promise<boolean>;

    download(urlPath: string): Promise<Buffer>;
}
