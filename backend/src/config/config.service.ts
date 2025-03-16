import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    const envFilePath = path.resolve(process.cwd(), '.env');
    this.envConfig = dotenv.parse(fs.existsSync(envFilePath) ? fs.readFileSync(envFilePath) : '');
  }

  get(key: string): string {
    return this.envConfig[key] || process.env[key] || '';
  }

  get databaseUrl(): string {
    return this.get('DATABASE_URL');
  }

  get jwtSecret(): string {
    return this.get('JWT_SECRET') || 'your-secret-key-here';
  }

  get jwtExpiresIn(): string {
    return this.get('JWT_EXPIRES_IN') || '1d';
  }

  get aiEngineUrl(): string {
    return this.get('AI_ENGINE_URL') || 'http://localhost:8000';
  }

  get frontendUrl(): string {
    return this.get('FRONTEND_URL') || 'http://localhost:4200';
  }
}