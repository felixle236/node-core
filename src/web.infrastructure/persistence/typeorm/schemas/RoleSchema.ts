import { BASE_SCHEMA } from './base/BaseSchema';

export const ROLE_SCHEMA = {
    TABLE_NAME: 'role',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        ID: 'id',
        NAME: 'name',
        LEVEL: 'level'
    },
    RELATED_MANY: {
        USERS: 'users'
    }
};
