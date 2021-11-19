export enum InjectDb {
    DbContext = 'db.context',
    RedisContext = 'redis.context'
}

export enum InjectRepository {
    UserOnlineStatus = 'user_online_status.repository',
    User = 'user.repository',
    Client = 'client.repository',
    Manager = 'manager.repository',
    Auth = 'auth.repository',
}

export enum InjectService {
    AuthJwt = 'auth_jwt.service',
    Log = 'log.service',
    Mail = 'mail.service',
    Notification = 'notification.service',
    PaymentPaypal = 'payment_paypal.service',
    PaymentStripe = 'payment_stripe.service',
    SMS = 'sms.service',
    SocketEmitter = 'socket_emitter.service',
    Storage = 'storage.service'
}
