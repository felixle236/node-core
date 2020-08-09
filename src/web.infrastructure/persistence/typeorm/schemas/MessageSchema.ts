export class MessageSchema {
    static TABLE_NAME = 'message';

    static COLUMNS = {
        ID: 'id',
        CREATED_AT: 'created_at',
        UPDATED_AT: 'updated_at',
        SENDER_ID: 'sender_id',
        RECEIVER_ID: 'receiver_id',
        ROOM: 'room',
        CONTENT: 'content'
    };

    static RELATED_ONE = {
        SENDER: 'sender',
        RECEIVER: 'receiver'
    };
}
