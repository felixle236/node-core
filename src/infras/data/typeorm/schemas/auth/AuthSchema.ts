import { BASE_SCHEMA } from '../base/BaseSchema';

export const AUTH_SCHEMA = {
    TABLE_NAME: 'auth',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        USER_ID: 'user_id',
        TYPE: 'type',
        USERNAME: 'username',
        PASSWORD: 'password',
        FORGOT_KEY: 'forgot_key',
        FORGOT_EXPIRE: 'forgot_expire'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity to map the entity related.
        USER: 'user'
    },
    RELATED_MANY: {

    }
};
