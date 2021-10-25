import { IsInt, Min } from '@shared/decorators/ValidationDecorator';

export abstract class BulkActionResponse<T> {
    @IsInt()
    @Min(0)
    total = 0;

    @IsInt()
    @Min(0)
    successes = 0;

    @IsInt()
    @Min(0)
    ignores = 0;

    @IsInt()
    @Min(0)
    failures = 0;

    abstract successItems: T[];

    abstract ignoreItems: T[];

    abstract failureItems: T[];

    constructor(total: number) {
        this.total = total;
    }

    success(item: T): void {
        this.successes++;
        this.successItems.push(item);
    }

    ignore(item: T): void {
        this.ignores++;
        this.ignoreItems.push(item);
    }

    fail(item: T): void {
        this.failures++;
        this.failureItems.push(item);
    }
}
