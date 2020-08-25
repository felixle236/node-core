export class SocketNamespace {
    static CONFIGURATION = {
        NAME: 'configurations',
        EVENTS: {
            USER_ONLINE_STATUS_CHANGED: 'user_online_status_changed',
            DISPLAY_BOTTOM_MENU_STATUS_CHANGED: 'display_bottom_menu_status_changed' // Demo about change config realtime for mobile application.
        }
    };

    // Demo about chat realtime.
    static MESSAGE = {
        NAME: 'messages',
        EVENTS: {
            MESSAGE_SEND: 'message_send',
            MESSAGE_RECEIVED: 'message_received',
            MESSAGE_STATUS_CHANGED: 'message_status_changed'
        }
    };
}
