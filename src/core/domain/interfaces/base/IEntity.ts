export interface IEntity<TIdentityType> {
    id: TIdentityType;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
