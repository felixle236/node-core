export class NumericTransformer {
    to(data: number | null): number | null {
        return data;
    }

    from(data: string | null): number | null {
        return data ? parseFloat(data) : null;
    }
}
