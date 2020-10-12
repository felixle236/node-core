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
        PASSWORD: 'password',
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
        ARCHIVED_AT: 'archived_at',
        FORGOT_KEY: 'forgot_key',
        FORGOT_EXPIRE: 'forgot_expire'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity.
        ROLE: 'role'
    }
};
