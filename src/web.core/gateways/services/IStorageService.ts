export interface IStorageService {
    createBucket(policy: string): Promise<void>;

    upload(urlPath: string, buffer: Buffer, mimetype?: string): Promise<boolean>;

    download(urlPath: string): Promise<Buffer>;

    delete(urlPath: string): Promise<boolean>;
}
