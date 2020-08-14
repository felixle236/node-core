import * as dotenv from 'dotenv';
import { LogProvider, MailProvider, NotificationProvider, PaymentProvider, SmsProvider, StorageProvider } from './Enums';
import { convertStringToBoolean } from '../libs/common';
dotenv.config();

// SYSTEM ENVIRONMENT

export const IS_DEVELOPMENT: boolean = process.env.NODE_ENV === 'development';

export const PROJECT_ID: string = process.env.PROJECT_ID ?? 'node-core';
export const PROJECT_NAME: string = process.env.PROJECT_NAME ?? 'Node Core';
export const PROTOTYPE: string = process.env.PROTOTYPE ?? 'http';
export const DOMAIN: string = process.env.DOMAIN ?? 'localhost';

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

export const DB_TYPE: string = process.env.DB_TYPE ?? 'postgres';
export const DB_HOST: string = process.env.DB_HOST ?? 'localhost';
export const DB_PORT: number = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432;
export const DB_NAME: string = process.env.DB_NAME ?? 'node_core';
export const DB_USER: string = process.env.DB_USER ?? 'postgres';
export const DB_PASS: string = process.env.DB_PASS ?? '123456';

// CONFIGURATION OF REDIS

export const REDIS_CONFIG_HOST: string = process.env.REDIS_CONFIG_HOST ?? 'localhost';
export const REDIS_CONFIG_PORT: number = process.env.REDIS_CONFIG_PORT ? Number(process.env.REDIS_CONFIG_PORT) : 6379;

// AUTHENTICATION SERVICE

export const AUTH_SIGNATURE: string = process.env.AUTH_SIGNATURE ?? '';
export const AUTH_SECRET_OR_PRIVATE_KEY: string = process.env.AUTH_SECRET_KEY ?? '';
export const AUTH_SECRET_OR_PUBLIC_KEY: string = process.env.AUTH_SECRET_KEY ?? '';

// LOG SERVICE

export const LOG_PROVIDER: number = process.env.LOG_PROVIDER ? Number(process.env.LOG_PROVIDER) : LogProvider.CONSOLE;

// STORAGE SERVICE

export const STORAGE_PROVIDER: number = process.env.STORAGE_PROVIDER ? Number(process.env.STORAGE_PROVIDER) : StorageProvider.CONSOLE;
export const BUCKET_NAME: string = process.env.BUCKET_NAME ?? 'dev';

export const MINIO_CONFIG_HOST: string = process.env.MINIO_CONFIG_HOST ?? 'localhost';
export const MINIO_CONFIG_PORT: number = process.env.MINIO_CONFIG_PORT ? Number(process.env.MINIO_CONFIG_PORT) : 9000;
export const MINIO_ACCESS_KEY: string = process.env.MINIO_ACCESS_KEY ?? '';
export const MINIO_SECRET_KEY: string = process.env.MINIO_SECRET_KEY ?? '';
export const IS_USE_SSL_MINIO: boolean = convertStringToBoolean(process.env.IS_USE_SSL_MINIO);

export const S3_REGION: string = process.env.S3_REGION ?? 'us-east-1';
export const S3_ACCESS_KEY: string = process.env.S3_ACCESS_KEY ?? '';
export const S3_SECRET_KEY: string = process.env.S3_SECRET_KEY ?? '';

// MAIL SERVICE

export const MAIL_PROVIDER: number = process.env.MAIL_PROVIDER ? Number(process.env.MAIL_PROVIDER) : MailProvider.CONSOLE;
export const MAIL_SENDER_NAME: string = process.env.MAIL_SENDER_NAME ?? '';
export const MAIL_SENDER_EMAIL: string = process.env.MAIL_SENDER_EMAIL ?? '';

export const GOOGLE_SMTP_USERNAME: string = process.env.GOOGLE_SMTP_USERNAME ?? '';
export const GOOGLE_SMTP_PASSWORD: string = process.env.GOOGLE_SMTP_PASSWORD ?? '';

export const SENDINBLUE_API_KEY: string = process.env.SENDINBLUE_API_KEY ?? '';

// SMS SERVICE

export const SMS_PROVIDER: number = process.env.SMS_PROVIDER ? Number(process.env.SMS_PROVIDER) : SmsProvider.CONSOLE;
export const SMS_SENDER_NAME: string = process.env.SMS_SENDER_NAME ?? '';

// PAYMENT SERVICE

export const PAYMENT_PROVIDER: number = process.env.PAYMENT_PROVIDER ? Number(process.env.PAYMENT_PROVIDER) : PaymentProvider.CONSOLE;
export const STRIPE_KEY: string = process.env.STRIPE_KEY ?? '';
export const PAYPAL_KEY: string = process.env.PAYPAL_KEY ?? '';

// NOTIFICATION SERVICE

export const NOTIFICATION_PROVIDER: number = process.env.NOTIFICATION_PROVIDER ? Number(process.env.NOTIFICATION_PROVIDER) : NotificationProvider.CONSOLE;
export const ANDROID_KEY: string = process.env.ANDROID_KEY ?? '';
export const IOS_KEY: string = process.env.IOS_KEY ?? '';
