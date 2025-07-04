class EnvConfig {
  BACKEND_URL: string;
  FORNTEND_URL: string;
  constructor() {
    this.BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
    this.FORNTEND_URL = process.env.FORNTEND_URL || "http://localhost:5555";
  }
}

export const envConfig = new EnvConfig();
