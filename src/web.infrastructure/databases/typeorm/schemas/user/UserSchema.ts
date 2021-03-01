import { BASE_SCHEMA } from '../base/BaseSchema';

export const USER_SCHEMA = {
    TABLE_NAME: 'users',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        ID: 'id',
        ROLE_ID: 'role_id',
        STATUS: 'status',
        FIRST_NAME: 'first_name',
        LAST_NAME: 'last_name',
        EMAIL: 'email',
        AVATAR: 'avatar',
        GENDER: 'gender',
        BIRTHDAY: 'birthday',
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
        ROLE: 'role'
    },
    RELATED_MANY: {
        AUTHS: 'auths'
    }
};
