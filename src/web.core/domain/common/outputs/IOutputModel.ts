export interface IOutputModel<T> {
    fromEntity(entity?: T): this | undefined;
}
