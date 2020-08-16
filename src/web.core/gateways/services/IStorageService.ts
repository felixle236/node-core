export interface IStorageService {
    upload(urlPath: string, buffer: Buffer): Promise<string>;

    download(urlPath: string): Promise<Buffer>;

    mapUrl(urlPath: string): string;
}
