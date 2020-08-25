export class DateTransformer {
    to(data: Date): Date {
        return data;
    }

    from(data: string): Date {
        return new Date(data);
    }
}
