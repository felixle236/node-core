export enum Environment {
    Local = 'local',
    Development = 'development',
    Staging = 'staging',
    Production = 'production'
}

export enum LogProvider {
    Winston = 1,
    GoogleWinston = 2,
    AwsWinston = 3
}

export enum StorageProvider {
    Console = 1,
    MinIO = 2,
    AwsS3 = 3,
    GoogleStorage = 4
}

export enum MailProvider {
    Console = 1,
    GoogleSmtp = 2,
    MailGun = 3,
    SendInBlue = 4
}

export enum SmsProvider {
    Console = 1,
    Twilio= 2,
    SendInBlue = 3
}

export enum NotificationProvider {
    Console = 1,
    NodePushNotification = 2
}
