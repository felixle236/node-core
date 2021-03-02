import { USER_SCHEMA } from '../user/UserSchema';

export const CLIENT_SCHEMA = {
    TABLE_NAME: 'client',
    COLUMNS: {
        ...USER_SCHEMA.COLUMNS,
        STATUS: 'status',
        EMAIL: 'email',
        PHONE: 'phone',
        ADDRESS: 'address',
        CULTURE: 'culture',
        CURRENCY: 'currency',
        ACTIVE_KEY: 'active_key',
        ACTIVE_EXPIRE: 'active_expire',
        ACTIVED_AT: 'actived_at',
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
