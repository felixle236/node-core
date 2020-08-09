export interface IDbEntity<T> {
    toEntity(): T;
    fromEntity(entity?: T): this | undefined;
}
