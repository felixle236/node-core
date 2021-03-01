import * as dotenv from 'dotenv';
import { LogProvider, MailProvider, NotificationProvider, SmsProvider, StorageProvider } from './ServiceProvider';
import { convertStringToBoolean } from '../libs/common';
dotenv.config();

// SYSTEM ENVIRONMENT

export const IS_DEVELOPMENT: boolean = process.env.NODE_ENV === 'development';

export const PROJECT_ID: string = process.env.PROJECT_ID ?? '';
export const PROJECT_NAME: string = process.env.PROJECT_NAME ?? '';
export const PROTOTYPE: string = process.env.PROTOTYPE ?? '';
export const DOMAIN: string = process.env.DOMAIN ?? '';

// API SERVICE

export const ENABLE_API_SERVICE: boolean = convertStringToBoolean(process.env.ENABLE_API_SERVICE);
export const API_PORT: number = Number(process.env.API_PORT);

// WEB SERVICE

export const ENABLE_WEB_SERVICE: boolean = convertStringToBoolean(process.env.ENABLE_WEB_SERVICE);
export const WEB_PORT: number = Number(process.env.WEB_PORT);

// SOCKET SERVICE

export const ENABLE_SOCKET_SERVICE: boolean = convertStringToBoolean(process.env.ENABLE_SOCKET_SERVICE);
export const SOCKET_PORT: number = Number(process.env.SOCKET_PORT);

// CONFIGURATION OF DATABASE

export const DB_TYPE: string = process.env.DB_TYPE ?? '';
export const DB_HOST: string = process.env.DB_HOST ?? '';
export const DB_PORT: number = process.env.DB_PORT ? Number(process.env.DB_PORT) : 0;
export const DB_NAME: string = process.env.DB_NAME ?? '';
export const DB_USER: string = process.env.DB_USER ?? '';
export const DB_PASS: string = process.env.DB_PASS ?? '';

// CONFIGURATION OF REDIS

export const REDIS_CONFIG_HOST: string = process.env.REDIS_CONFIG_HOST ?? '';
export const REDIS_CONFIG_PORT: number = process.env.REDIS_CONFIG_PORT ? Number(process.env.REDIS_CONFIG_PORT) : 0;
export const REDIS_CONFIG_PASSWORD: string | undefined = process.env.REDIS_CONFIG_PASSWORD || undefined;
export const REDIS_CONFIG_PREFIX: string | undefined = process.env.REDIS_CONFIG_PREFIX || undefined;

// AUTHENTICATION SERVICE

export const AUTH_SIGNATURE: string = process.env.AUTH_SIGNATURE ?? '';
export const AUTH_SECRET_OR_PRIVATE_KEY: string = process.env.AUTH_SECRET_KEY ?? '';
export const AUTH_SECRET_OR_PUBLIC_KEY: string = process.env.AUTH_SECRET_KEY ?? '';

// LOG SERVICE

export const LOG_PROVIDER: number = process.env.LOG_PROVIDER ? Number(process.env.LOG_PROVIDER) : LogProvider.WINSTON;

// STORAGE SERVICE

export const STORAGE_PROVIDER: number = process.env.STORAGE_PROVIDER ? Number(process.env.STORAGE_PROVIDER) : StorageProvider.CONSOLE;
export const BUCKET_NAME: string = process.env.BUCKET_NAME ?? '';

export const STORAGE_CONFIG_HOST: string = process.env.STORAGE_CONFIG_HOST ?? '';
export const STORAGE_CONFIG_PORT: number = process.env.STORAGE_CONFIG_PORT ? Number(process.env.STORAGE_CONFIG_PORT) : 0;
export const MINIO_ACCESS_KEY: string = process.env.MINIO_ACCESS_KEY ?? '';
export const MINIO_SECRET_KEY: string = process.env.MINIO_SECRET_KEY ?? '';
export const IS_USE_SSL_MINIO: boolean = convertStringToBoolean(process.env.IS_USE_SSL_MINIO);

export const S3_REGION: string = process.env.S3_REGION ?? '';
export const S3_ACCESS_KEY: string = process.env.S3_ACCESS_KEY ?? '';
export const S3_SECRET_KEY: string = process.env.S3_SECRET_KEY ?? '';

export const GOOGLE_APPLICATION_CREDENTIALS: string = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? '';
export const GOOGLE_STORAGE_LOCATION: string = process.env.GOOGLE_STORAGE_LOCATION ?? '';
export const GOOGLE_STORAGE_CLASS: string = process.env.GOOGLE_STORAGE_CLASS ?? '';

export const STORAGE_URL: string = STORAGE_PROVIDER === StorageProvider.MINIO
    ? `http://${STORAGE_CONFIG_HOST}` + (STORAGE_CONFIG_PORT === 80 ? '' : `:${STORAGE_CONFIG_PORT}`) + `/${BUCKET_NAME}/`
    : STORAGE_PROVIDER === StorageProvider.AWS_S3 ? `https://s3.${S3_REGION}.amazonaws.com/${BUCKET_NAME}/` : `http://localhost/${BUCKET_NAME}/`;

// MAIL SERVICE

export const MAIL_PROVIDER: number = process.env.MAIL_PROVIDER ? Number(process.env.MAIL_PROVIDER) : MailProvider.CONSOLE;
export const MAIL_SENDER_NAME: string = process.env.MAIL_SENDER_NAME ?? '';
export const MAIL_SENDER_EMAIL: string = process.env.MAIL_SENDER_EMAIL ?? '';

export const GOOGLE_SMTP_USERNAME: string = process.env.GOOGLE_SMTP_USERNAME ?? '';
export const GOOGLE_SMTP_PASSWORD: string = process.env.GOOGLE_SMTP_PASSWORD ?? '';

export const MAILGUN_DOMAIN: string = process.env.MAILGUN_DOMAIN ?? '';
export const MAILGUN_API_KEY: string = process.env.MAILGUN_API_KEY ?? '';

export const SENDINBLUE_API_KEY: string = process.env.SENDINBLUE_API_KEY ?? '';

// SMS SERVICE

export const SMS_PROVIDER: number = process.env.SMS_PROVIDER ? Number(process.env.SMS_PROVIDER) : SmsProvider.CONSOLE;
export const SMS_SENDER_OR_PHONE: string = process.env.SMS_SENDER_OR_PHONE ?? '';

export const TWILIO_ACCOUNT_SID: string = process.env.TWILIO_ACCOUNT_SID ?? '';
export const TWILIO_AUTH_TOKEN: string = process.env.TWILIO_AUTH_TOKEN ?? '';

// PAYMENT SERVICE

export const STRIPE_KEY: string = process.env.STRIPE_KEY ?? '';
export const PAYPAL_KEY: string = process.env.PAYPAL_KEY ?? '';

// NOTIFICATION SERVICE

export const NOTIFICATION_PROVIDER: number = process.env.NOTIFICATION_PROVIDER ? Number(process.env.NOTIFICATION_PROVIDER) : NotificationProvider.CONSOLE;
export const ANDROID_KEY: string = process.env.ANDROID_KEY ?? '';
export const IOS_KEY: string = process.env.IOS_KEY ?? '';
