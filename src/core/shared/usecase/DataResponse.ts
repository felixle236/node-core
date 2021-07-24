export abstract class DataResponse<T> {
    abstract data: T;

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    abstract setData(data: any): void;
}
