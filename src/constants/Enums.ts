
export enum StorageType {
    LOGGING = 0,
    MINIO = 1,
    AWS_S3 = 2,
    GOOGLE_STORAGE = 3
}

export enum MailSenderType {
    LOGGING = 0,
    GOOGLE_SMTP = 1,
    SEND_IN_BLUE = 2
}

export enum SmsSenderType {
    LOGGING = 0,
    SEND_IN_BLUE = 1
}

export enum PaymentSenderType {
    LOGGING = 0,
    STRIPE = 1,
    PAYPAL = 2
}
