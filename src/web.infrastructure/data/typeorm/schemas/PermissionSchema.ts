export class PermissionSchema {
    static TABLE_NAME = 'permission';

    static COLUMNS = {
        ID: 'id',
        ROLE_ID: 'role_id',
        CLAIM: 'claim'
    };

    static RELATED_ONE = {
        ROLE: 'role'
    };
}
