import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { log } from "node:console";

export const loadEnv = () => {
  // Default to 'stage' environment, allow override via ENV environment variable
  const env = process.env.ENV || 'stage';
  
  // Load unified environment configuration
  // Real config files are gitignored; fall back to the committed .example template
  // (CI injects real values as environment variables, which dotenv does not override)
  const localPath = `./config/${env}_config.env`;
  const examplePath = `${localPath}.example`;
  const configPath = fs.existsSync(localPath) ? localPath : examplePath;
  if (fs.existsSync(configPath)) {
    log(`Loading ${env} environment configuration from: ${configPath}`);
    dotenv.config({ path: configPath });
  } else {
    throw new Error(`Configuration file not found: ${localPath}`);
  }
};

export const getEnvValue = (key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return process.env[key];
};
