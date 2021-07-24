import { BASE_SCHEMA } from '../base/BaseSchema';

export const USER_SCHEMA = {
    TABLE_NAME: 'users',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        ROLE_ID: 'role_id',
        FIRST_NAME: 'first_name',
        LAST_NAME: 'last_name',
        AVATAR: 'avatar',
        GENDER: 'gender',
        BIRTHDAY: 'birthday'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity to map the entity related.

    },
    RELATED_MANY: {
        AUTHS: 'auths'
    }
};
