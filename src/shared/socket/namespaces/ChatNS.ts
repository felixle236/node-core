export class ChatNS {
  static NAME = 'chat';
  static EVENTS = {
    ONLINE_STATUS_CHANGED: 'online_status_changed',
    CHANNEL_CREATE: 'channel_created',
    CHANNEL_DELETE: 'channel_deleted',
    MESSAGE_CREATE: 'message_created',
    MESSAGE_UPDATE: 'message_updated',
    MESSAGE_DELETE: 'message_deleted',
    MESSAGE_RECEIVE: 'message_received',
    MESSAGE_READ: 'message_read',
  };
}
