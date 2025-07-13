export class AppConfig {
  PORT: number;
  HOST: string;
  URL: string;
  BACKEND_URL: string;
  FRONTEND_URL: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_USERNAME: string;
  REDIS_PASSWORD: string;
  REDIS_SESSION_EXPIRE: number;
  DB_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  REDIS_TTL_CACHE: number;
  MOMO_PARTNER_CODE: string;
  MOMO_ACCESS_KEY: string;
  MOMO_SECRET_KEY: string;
  MOMO_API_URL: string;
  MOMO_REDIRECT_URL: string;
  MOMO_IPN_URL: string;

  constructor() {
    this.PORT = Number(process.env.SERVER_PORT ?? 3000);
    this.HOST = process.env.SERVER_HOST || 'localhost';
    this.URL = process.env.SERVER_URL || `http://${this.HOST}:${this.PORT}`;
    this.BACKEND_URL =
      process.env.BACKEND_URL || `http://${this.HOST}:${this.PORT}`;
    this.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5555';
    this.REDIS_HOST = process.env.REDIS_HOST || 'localhost';
    this.REDIS_PORT = Number(process.env.REDIS_PORT ?? 6379);
    this.REDIS_USERNAME = process.env.REDIS_USERNAME || '';
    this.REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';
    this.DB_URL = process.env.DATABASE_URL || '';
    this.JWT_SECRET = process.env.JWT_SECRET || '';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
    this.REDIS_SESSION_EXPIRE = 60 * 60; // 1h
    this.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
    this.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
    this.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
    this.REDIS_TTL_CACHE = 4 * 3600;
    this.MOMO_PARTNER_CODE = process.env.MOMO_PARTNER_CODE || '';
    this.MOMO_ACCESS_KEY = process.env.MOMO_ACCESS_KEY || '';
    this.MOMO_SECRET_KEY = process.env.MOMO_SECRET_KEY || '';
    this.MOMO_API_URL = process.env.MOMO_API_URL || '';
    this.MOMO_REDIRECT_URL = process.env.MOMO_REDIRECT_URL || '';
    this.MOMO_IPN_URL = process.env.MOMO_IPN_URL || '';
  }
}

export const appConfig = new AppConfig();
