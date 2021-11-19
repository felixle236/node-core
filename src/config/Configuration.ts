/* eslint-disable @typescript-eslint/naming-convention */
import dotenv from 'dotenv';
import { convertStringToBoolean } from 'utils/converter';
import { Environment, LogProvider, MailProvider, NotificationProvider, SmsProvider, StorageProvider } from '../shared/types/Environment';
dotenv.config();

// SYSTEM ENVIRONMENT
const keyEnv = Object.keys(Environment).find(key => Environment[key] === process.env.NODE_ENV);
export const ENVIRONMENT: Environment = keyEnv ? Environment[keyEnv] : Environment.Local;

export const PROJECT_ID: string = process.env.PROJECT_ID ?? '';
export const PROJECT_NAME: string = process.env.PROJECT_NAME ?? '';
export const PROTOTYPE: string = process.env.PROTOTYPE ?? '';
export const DOMAIN: string = process.env.DOMAIN ?? '';

// WEB API

export const ENABLE_WEB_API: boolean = convertStringToBoolean(process.env.ENABLE_WEB_API);
export const WEB_API_PORT = Number(process.env.WEB_API_PORT);
export const WEB_API_URL: string = process.env.WEB_API_URL ?? '';
export const WEB_API_PRIVATE_KEY: string = process.env.WEB_API_PRIVATE_KEY ?? '';

// MOBILE API

export const ENABLE_MOBILE_API: boolean = convertStringToBoolean(process.env.ENABLE_MOBILE_API);
export const MOBILE_API_PORT = Number(process.env.MOBILE_API_PORT);
export const MOBILE_API_URL: string = process.env.MOBILE_API_URL ?? '';

// SWAGGER UI

export const ENABLE_SWAGGER_UI: boolean = convertStringToBoolean(process.env.ENABLE_SWAGGER_UI);
export const SWAGGER_UI_PORT = Number(process.env.SWAGGER_UI_PORT);
export const SWAGGER_UI_URL: string = process.env.SWAGGER_UI_URL ?? '';

// WEB UI

export const ENABLE_WEB_UI: boolean = convertStringToBoolean(process.env.ENABLE_WEB_UI);
export const WEB_UI_PORT = Number(process.env.WEB_UI_PORT);
export const WEB_UI_URL: string = process.env.WEB_UI_URL ?? '';

// WEB SOCKET

export const ENABLE_WEB_SOCKET: boolean = convertStringToBoolean(process.env.ENABLE_WEB_SOCKET);
export const WEB_SOCKET_PORT = Number(process.env.WEB_SOCKET_PORT);
export const WEB_SOCKET_URL: string = process.env.WEB_SOCKET_URL ?? '';

// CLOUD CREDENTIALS

export const AWS_REGION: string = process.env.AWS_REGION ?? '';
export const AWS_ACCESS_KEY: string = process.env.AWS_ACCESS_KEY ?? '';
export const AWS_SECRET_KEY: string = process.env.AWS_SECRET_KEY ?? '';

export const GOOGLE_APPLICATION_CREDENTIALS: string = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? '';

// DATABASE CONFIGURATION

export const DB_TYPE: string = process.env.DB_TYPE ?? '';
export const DB_HOST: string = process.env.DB_HOST ?? '';
export const DB_PORT: number = process.env.DB_PORT ? Number(process.env.DB_PORT) : 0;
export const DB_NAME: string = process.env.DB_NAME ?? '';
export const DB_USER: string = process.env.DB_USER ?? '';
export const DB_PASS: string = process.env.DB_PASS ?? '';

// DB CACHING CONFIGURATION

export const DB_CACHING_HOST: string = process.env.DB_CACHING_HOST ?? '';
export const DB_CACHING_PORT: number = process.env.DB_CACHING_PORT ? Number(process.env.DB_CACHING_PORT) : 0;
export const DB_CACHING_PASSWORD: string | undefined = process.env.DB_CACHING_PASSWORD || undefined;
export const DB_CACHING_PREFIX: string | undefined = process.env.DB_CACHING_PREFIX || undefined;

// DB SOCKET CONFIGURATION

export const DB_SOCKET_HOST: string = process.env.DB_SOCKET_HOST ?? '';
export const DB_SOCKET_PORT: number = process.env.DB_SOCKET_PORT ? Number(process.env.DB_SOCKET_PORT) : 0;
export const DB_SOCKET_PASSWORD: string | undefined = process.env.DB_SOCKET_PASSWORD || undefined;
export const DB_SOCKET_PREFIX: string | undefined = process.env.DB_SOCKET_PREFIX || undefined;

// AUTHENTICATION SERVICE

export const AUTH_SIGNATURE: string = process.env.AUTH_SIGNATURE ?? '';
export const AUTH_SECRET_OR_PRIVATE_KEY: string = process.env.AUTH_SECRET_KEY ?? '';
export const AUTH_SECRET_OR_PUBLIC_KEY: string = process.env.AUTH_SECRET_KEY ?? '';

// LOG SERVICE

export const LOG_PROVIDER: LogProvider = process.env.LOG_PROVIDER ? Number(process.env.LOG_PROVIDER) : LogProvider.Winston;

// STORAGE SERVICE

export const STORAGE_PROVIDER: StorageProvider = process.env.STORAGE_PROVIDER ? Number(process.env.STORAGE_PROVIDER) : StorageProvider.Console;
export const STORAGE_URL: string = process.env.STORAGE_URL ?? 'http://localhost';
export const STORAGE_UPLOAD_DIR: string = process.env.STORAGE_UPLOAD_DIR ?? 'uploads';
export const STORAGE_BUCKET_NAME: string = process.env.STORAGE_BUCKET_NAME ?? '';

export const MINIO_HOST: string = process.env.MINIO_HOST ?? '';
export const MINIO_PORT: number = process.env.MINIO_PORT ? Number(process.env.MINIO_PORT) : 0;
export const MINIO_ACCESS_KEY: string = process.env.MINIO_ACCESS_KEY ?? '';
export const MINIO_SECRET_KEY: string = process.env.MINIO_SECRET_KEY ?? '';
export const MINIO_USE_SSL: boolean = convertStringToBoolean(process.env.MINIO_USE_SSL);

export const GOOGLE_STORAGE_LOCATION: string = process.env.GOOGLE_STORAGE_LOCATION ?? '';
export const GOOGLE_STORAGE_CLASS: string = process.env.GOOGLE_STORAGE_CLASS ?? '';

// MAIL SERVICE

export const MAIL_PROVIDER: MailProvider = process.env.MAIL_PROVIDER ? Number(process.env.MAIL_PROVIDER) : MailProvider.Console;
export const MAIL_SENDER_NAME: string = process.env.MAIL_SENDER_NAME ?? '';
export const MAIL_SENDER_EMAIL: string = process.env.MAIL_SENDER_EMAIL ?? '';

export const GOOGLE_SMTP_USERNAME: string = process.env.GOOGLE_SMTP_USERNAME ?? '';
export const GOOGLE_SMTP_PASSWORD: string = process.env.GOOGLE_SMTP_PASSWORD ?? '';

export const MAILGUN_DOMAIN: string = process.env.MAILGUN_DOMAIN ?? '';
export const MAILGUN_API_KEY: string = process.env.MAILGUN_API_KEY ?? '';

export const SENDINBLUE_API_KEY: string = process.env.SENDINBLUE_API_KEY ?? '';

// SMS SERVICE

export const SMS_PROVIDER: SmsProvider = process.env.SMS_PROVIDER ? Number(process.env.SMS_PROVIDER) : SmsProvider.Console;
export const SMS_SENDER_OR_PHONE: string = process.env.SMS_SENDER_OR_PHONE ?? '';

export const TWILIO_ACCOUNT_SID: string = process.env.TWILIO_ACCOUNT_SID ?? '';
export const TWILIO_AUTH_TOKEN: string = process.env.TWILIO_AUTH_TOKEN ?? '';

// PAYMENT SERVICE

export const STRIPE_KEY: string = process.env.STRIPE_KEY ?? '';
export const PAYPAL_KEY: string = process.env.PAYPAL_KEY ?? '';

// NOTIFICATION SERVICE

export const NOTIFICATION_PROVIDER: NotificationProvider = process.env.NOTIFICATION_PROVIDER ? Number(process.env.NOTIFICATION_PROVIDER) : NotificationProvider.Console;
export const FCM_KEY: string = process.env.FCM_KEY ?? '';
export const APN_KEY: string = process.env.APN_KEY ?? '';
