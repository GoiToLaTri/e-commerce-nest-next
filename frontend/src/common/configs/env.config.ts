class EnvConfig {
  BACKEND_URL: string;
  FRONTEND_URL: string;
  constructor() {
    this.BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
    this.FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5555";
  }
}

export const envConfig = new EnvConfig();
