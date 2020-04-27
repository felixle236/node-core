export class RoleSchema {
    static TABLE_NAME = 'role';

    static COLUMNS = {
        ID: 'id',
        CREATED_AT: 'created_at',
        UPDATED_AT: 'updated_at',
        DELETED_AT: 'deleted_at',
        NAME: 'name',
        LEVEL: 'level'
    };

    static RELATED_MANY = {
        USERS: 'users',
        PERMISSIONS: 'permissions'
    };
}
