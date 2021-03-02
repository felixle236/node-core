import { USER_SCHEMA } from '../user/UserSchema';

export const MANAGER_SCHEMA = {
    TABLE_NAME: 'manager',
    COLUMNS: {
        ...USER_SCHEMA.COLUMNS,
        STATUS: 'status',
        EMAIL: 'email',
        ARCHIVED_AT: 'archived_at'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity to map the entity related.
        ...USER_SCHEMA.RELATED_ONE
    },
    RELATED_MANY: {
        // The field name that we're defined into entity to map the entity related.
        ...USER_SCHEMA.RELATED_MANY
    }
};
