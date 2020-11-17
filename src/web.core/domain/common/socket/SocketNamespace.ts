export class SocketNamespace {
    static CONFIGURATION = {
        NAME: 'configurations',
        EVENTS: {
            DISPLAY_BOTTOM_MENU_STATUS_CHANGED: 'display_bottom_menu_status_changed' // Demo about change config realtime for mobile application.
        }
    };

    // Demo about tracking realtime.
    static TRACKING = {
        NAME: 'trackings',
        EVENTS: {
            SHIPPER_LOCATION_CHANGED: 'shipper_location_changed',
            ORDER_CANCEL: 'order_cancel',
            ORDER_READY: 'order_ready',
            ORDER_PREPARING: 'order_preparing',
            ORDER_SHIPPER_ACCEPT: 'order_shipper_accept',
            ORDER_DELIVERING: 'order_delivering',
            ORDER_COMPLETE: 'order_complete'
        }
    };

    // Demo about chat realtime.
    static MESSAGE = {
        NAME: 'messages',
        EVENTS: {
            USER_ONLINE_STATUS_CHANGED: 'user_online_status_changed',
            MESSAGE_SEND: 'message_send',
            MESSAGE_RECEIVED: 'message_received',
            MESSAGE_STATUS_CHANGED: 'message_status_changed'
        }
    };
}
