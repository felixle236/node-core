export interface IDbMigration {
    /**
     * Migration id.
     * Indicates order of the executed migrations.
     */
    id: number | undefined;
    /**
     * Timestamp of the migration.
     */
    timestamp: number;
    /**
     * Name of the migration (class name).
     */
    name: string;
}
