export class BulkAction {
    total: number = 0;
    successes: number = 0;
    ignores: number = 0;
    failures: number = 0;
    failureIndexs: number[] = [];

    constructor(total: number) {
        this.total = total;
    }

    success() {
        this.successes++;
    }

    ignore() {
        this.ignores++;
    }

    fail(index: number) {
        this.failures++;
        if (this.failureIndexs.length < 100)
            this.failureIndexs.push(index);
    }
}
