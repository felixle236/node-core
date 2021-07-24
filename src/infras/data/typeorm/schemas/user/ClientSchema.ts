import { USER_SCHEMA } from './UserSchema';

export const CLIENT_SCHEMA = {
    TABLE_NAME: 'client',
    COLUMNS: {
        ...USER_SCHEMA.COLUMNS,
        EMAIL: 'email',
        PHONE: 'phone',
        ADDRESS: 'address',
        LOCALE: 'locale',
        STATUS: 'status',
        ACTIVE_KEY: 'active_key',
        ACTIVE_EXPIRE: 'active_expire',
        ACTIVED_AT: 'actived_at',
        ARCHIVED_AT: 'archived_at'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity to map the entity related.

    },
    RELATED_MANY: {

    }
};
