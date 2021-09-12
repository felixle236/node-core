export interface IDataResponse {
    data: any;

    setData(data: any): void;
}

export abstract class DataResponse<T> implements IDataResponse {
    abstract data: T;

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    abstract setData(data: any): void;
}
