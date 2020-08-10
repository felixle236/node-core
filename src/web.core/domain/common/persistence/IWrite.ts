export interface IWrite<TEntity, TIdentityType> {
    create(data: TEntity): Promise<TIdentityType | undefined>;
    update(id: TIdentityType, data: TEntity): Promise<boolean>;
    delete(id: TIdentityType): Promise<boolean>;
}
