export class UserSchema {
    static TABLE_NAME = 'users';

    static COLUMNS = {
        ID: 'id',
        CREATED_AT: 'created_at',
        UPDATED_AT: 'updated_at',
        DELETED_AT: 'deleted_at',
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
    };

    static RELATED_ONE = {
        ROLE: 'role'
    };

    static RELATED_MANTY = {
        SENDERS: 'senders',
        RECEIVERS: 'receivers'
    };
}
