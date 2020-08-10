export interface IFilter {
    skip: number;
    limit: number;

    maxLimit(val: number): void;
}
