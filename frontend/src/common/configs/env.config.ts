class EnvConfig {
  BACKEND_URL: string;
  constructor() {
    this.BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
  }
}

export const envConfig = new EnvConfig();
