export enum SortType {
    ASC = 'ASC',
    DESC = 'DESC'
}

export enum StorageType {
    LOGGING = 0,
    MINIO = 1,
    AWS_S3 = 2,
    GOOGLE_STORAGE = 3
}

export enum MailType {
    LOGGING = 0,
    GOOGLE_SMTP = 1,
    SEND_IN_BLUE = 2
}

export enum SmsType {
    LOGGING = 0,
    SEND_IN_BLUE = 1
}

export enum PaymentType {
    LOGGING = 0,
    STRIPE = 1,
    PAYPAL = 2
}

export enum RoleId {
    SUPER_ADMIN = 1,
    COMMON_USER = 2
}

export enum UserStatus {
    INACTIVE = 'inactive',
    ACTIVED = 'actived',
    ARCHIVED = 'archived'
}

export enum GenderType {
    MALE = 'male',
    FEMALE = 'female'
}
