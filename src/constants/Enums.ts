
export enum LogProvider {
    CONSOLE = 1,
    LOG_FILE = 2,
    LOG_STASH = 3
}

export enum StorageProvider {
    CONSOLE = 0,
    MINIO = 1,
    AWS_S3 = 2,
    GOOGLE_STORAGE = 3
}

export enum MailProvider {
    CONSOLE = 0,
    GOOGLE_SMTP = 1,
    SEND_IN_BLUE = 2
}

export enum SmsProvider {
    CONSOLE = 0,
    SEND_IN_BLUE = 1
}

export enum PaymentProvider {
    CONSOLE = 0,
    STRIPE = 1,
    PAYPAL = 2
}

export enum NotificationProvider {
    CONSOLE = 0,
    NODE_PUSH_NOTIFICATION = 1
}
