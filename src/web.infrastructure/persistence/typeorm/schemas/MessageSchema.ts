import { BASE_SCHEMA } from './base/BaseSchema';

export const MESSAGE_SCHEMA = {
    TABLE_NAME: 'message',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        ID: 'id',
        CREATED_AT: 'created_at',
        UPDATED_AT: 'updated_at',
        SENDER_ID: 'sender_id',
        RECEIVER_ID: 'receiver_id',
        ROOM: 'room',
        CONTENT: 'content'
    },
    RELATED_ONE: {
        SENDER: 'sender',
        RECEIVER: 'receiver'
    }
};
