export class NumericTransformer {
  to(data?: number): number | undefined {
    return data;
  }

  from(data?: string): number | undefined {
    return data ? parseFloat(data) : undefined;
  }
}
