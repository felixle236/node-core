import { IsInt, IsObject, Min } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class Pagination {
    @IsInt()
    @Min(0)
    skip: number;

    @IsInt()
    @Min(1)
    limit: number;

    @IsInt()
    @Min(0)
    total: number;
}

export abstract class PaginationResponse<T> {
    @IsObject()
    @JSONSchema({ type: 'object', $ref: '#/components/schemas/' + Pagination.name })
    pagination: Pagination;

    abstract data: T[];

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    abstract setData(data: any): void;

    setPagination(total: number, skip: number, limit: number): void {
        this.pagination = new Pagination();
        this.pagination.total = total;
        this.pagination.skip = skip;
        this.pagination.limit = limit;
    }
}
