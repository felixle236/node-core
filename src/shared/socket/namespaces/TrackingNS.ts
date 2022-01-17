export class TrackingNS {
  static NAME = 'tracking';
  static EVENTS = {
    SHIPPER_LOCATION_CHANGED: 'shipper_location_changed',
    ORDER_CANCEL: 'order_cancelled',
    ORDER_READY: 'order_ready',
    ORDER_PREPARING: 'order_preparing',
    ORDER_SHIPPER_ACCEPT: 'order_shipper_accepted',
    ORDER_DELIVERING: 'order_delivering',
    ORDER_COMPLETE: 'order_completed',
  };
}
