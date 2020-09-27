import { BASE_SCHEMA } from './base/BaseSchema';

export const ROLE_SCHEMA = {
    TABLE_NAME: 'role',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        ID: 'id',
        NAME: 'name'
    },
    RELATED_MANY: {
        // Table name
        USER: 'users'
    }
};
