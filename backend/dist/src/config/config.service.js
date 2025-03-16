"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const common_1 = require("@nestjs/common");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
let ConfigService = class ConfigService {
    envConfig;
    constructor() {
        const envFilePath = path.resolve(process.cwd(), '.env');
        this.envConfig = dotenv.parse(fs.existsSync(envFilePath) ? fs.readFileSync(envFilePath) : '');
    }
    get(key) {
        return this.envConfig[key] || process.env[key] || '';
    }
    get databaseUrl() {
        return this.get('DATABASE_URL');
    }
    get jwtSecret() {
        return this.get('JWT_SECRET') || 'your-secret-key-here';
    }
    get jwtExpiresIn() {
        return this.get('JWT_EXPIRES_IN') || '1d';
    }
    get aiEngineUrl() {
        return this.get('AI_ENGINE_URL') || 'http://localhost:8000';
    }
    get frontendUrl() {
        return this.get('FRONTEND_URL') || 'http://localhost:4200';
    }
};
exports.ConfigService = ConfigService;
exports.ConfigService = ConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ConfigService);
//# sourceMappingURL=config.service.js.map