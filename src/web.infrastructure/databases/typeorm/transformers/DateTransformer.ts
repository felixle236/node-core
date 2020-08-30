export class DateTransformer {
    to(data: Date | null): Date | null {
        return data;
    }

    from(data: string | null): Date | null {
        return data ? new Date(data) : null;
    }
}
