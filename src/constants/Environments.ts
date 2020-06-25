import * as dotenv from 'dotenv';
import { MailType, PaymentType, SmsType, StorageType } from './Enums';
dotenv.config();

// SYSTEM ENVIRONMENT

export const IS_DEVELOPMENT: boolean = process.env.NODE_ENV === 'development';

export const PROJECT_ID: string = process.env.PROJECT_ID || '';
export const PROJECT_NAME: string = process.env.PROJECT_NAME || '';
export const PROTOTYPE: string = process.env.PROTOTYPE || 'http';
export const DOMAIN: string = process.env.DOMAIN || 'localhost';

// API SERVICE

export const ENABLE_API_SERVICE: boolean = process.env.ENABLE_API_SERVICE ? JSON.parse(process.env.ENABLE_API_SERVICE) : true;
export const API_PORT: number = process.env.API_PORT ? Number(process.env.API_PORT) : 3000;

// WEB SERVICE

export const ENABLE_WEB_SERVICE: boolean = process.env.ENABLE_WEB_SERVICE ? JSON.parse(process.env.ENABLE_WEB_SERVICE) : false;
export const WEB_PORT: number = process.env.WEB_PORT ? Number(process.env.WEB_PORT) : 4000;

// SOCKET SERVICE

export const ENABLE_SOCKET_SERVICE: boolean = process.env.ENABLE_SOCKET_SERVICE ? JSON.parse(process.env.ENABLE_SOCKET_SERVICE) : false;
export const SOCKET_PORT: number = process.env.SOCKET_PORT ? Number(process.env.SOCKET_PORT) : 5000;

// LOGGING

export const ENABLE_WRITE_LOG: boolean = process.env.ENABLE_WRITE_LOG ? JSON.parse(process.env.ENABLE_WRITE_LOG) : false;
export const ENABLE_DATA_LOGGING: boolean = process.env.ENABLE_DATA_LOGGING ? JSON.parse(process.env.ENABLE_DATA_LOGGING) : false;
export const ENABLE_QUERY_LOGGING: boolean = process.env.ENABLE_QUERY_LOGGING ? JSON.parse(process.env.ENABLE_QUERY_LOGGING) : false;

// CONFIGURATION OF DATABASE

export const DB_TYPE: string = process.env.DB_TYPE || '';
export const DB_HOST: string = process.env.DB_HOST || 'localhost';
export const DB_PORT: number = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432;
export const DB_NAME: string = process.env.DB_NAME || '';
export const DB_USER: string = process.env.DB_USER || '';
export const DB_PASS: string = process.env.DB_PASS || '';

// CONFIGURATION OF REDIS

export const REDIS_CONFIG_HOST: string = process.env.REDIS_CONFIG_HOST || 'localhost';
export const REDIS_CONFIG_PORT: number = process.env.REDIS_CONFIG_PORT ? Number(process.env.REDIS_CONFIG_PORT) : 6379;

// AUTHENTICATION

export const AUTH_SIGNATURE: string = process.env.AUTH_SIGNATURE || '';
export const AUTH_SECRET_OR_PRIVATE_KEY: string = process.env.AUTH_SECRET_KEY || '';
export const AUTH_SECRET_OR_PUBLIC_KEY: string = process.env.AUTH_SECRET_KEY || '';

// STORAGE

export const STORAGE_TYPE: number = process.env.STORAGE_TYPE ? Number(process.env.STORAGE_TYPE) : StorageType.LOGGING;
export const BUCKET_NAME: string = process.env.BUCKET_NAME || 'dev';

export const MINIO_CONFIG_HOST: string = process.env.MINIO_CONFIG_HOST || 'localhost';
export const MINIO_CONFIG_PORT: number = process.env.MINIO_CONFIG_PORT ? Number(process.env.MINIO_CONFIG_PORT) : 9000;
export const MINIO_ACCESS_KEY: string = process.env.MINIO_ACCESS_KEY || '';
export const MINIO_SECRET_KEY: string = process.env.MINIO_SECRET_KEY || '';
export const IS_USE_SSL_MINIO: boolean = process.env.IS_USE_SSL_MINIO ? JSON.parse(process.env.IS_USE_SSL_MINIO) : false;

export const S3_REGION: string = process.env.S3_REGION || 'us-east-1';
export const S3_ACCESS_KEY: string = process.env.S3_ACCESS_KEY || '';
export const S3_SECRET_KEY: string = process.env.S3_SECRET_KEY || '';

// MAIL

export const MAIL_TYPE: number = process.env.MAIL_TYPE ? Number(process.env.MAIL_TYPE) : MailType.LOGGING;
export const MAIL_SENDER_NAME: string = process.env.MAIL_SENDER_NAME || '';
export const MAIL_SENDER_EMAIL: string = process.env.MAIL_SENDER_EMAIL || '';

export const GOOGLE_SMTP_USERNAME: string = process.env.GOOGLE_SMTP_USERNAME || '';
export const GOOGLE_SMTP_PASSWORD: string = process.env.GOOGLE_SMTP_PASSWORD || '';

export const SENDINBLUE_API_KEY: string = process.env.SENDINBLUE_API_KEY || '';

// SMS

export const SMS_TYPE: number = process.env.SMS_TYPE ? Number(process.env.SMS_TYPE) : SmsType.LOGGING;
export const SMS_SENDER_NAME: string = process.env.SMS_SENDER_NAME || '';

// PAYMENT

export const PAYMENT_TYPE: number = process.env.PAYMENT_TYPE ? Number(process.env.PAYMENT_TYPE) : PaymentType.LOGGING;
export const STRIPE_KEY: string = process.env.STRIPE_KEY || '';
export const PAYPAL_KEY: string = process.env.PAYPAL_KEY || '';

// NOTIFICATION

export const ENABLE_NOTIFICATION: boolean = process.env.ENABLE_NOTIFICATION ? JSON.parse(process.env.ENABLE_NOTIFICATION) : false;
export const ANDROID_KEY: string = process.env.ANDROID_KEY || '';
export const IOS_KEY: string = process.env.IOS_KEY || '';
