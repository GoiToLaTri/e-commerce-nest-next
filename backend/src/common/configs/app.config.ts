export class AppConfig {
  PORT: number;
  HOST: string;
  URL: string;
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

  constructor() {
    this.PORT = Number(process.env.SERVER_PORT ?? 3000);
    this.HOST = process.env.SERVER_HOST || 'localhost';
    this.URL = process.env.SERVER_URL || `http://${this.HOST}:${this.PORT}`;
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
  }
}

export const appConfig = new AppConfig();
