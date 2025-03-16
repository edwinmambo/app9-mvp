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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const config_service_1 = require("../config/config.service");
let AiService = class AiService {
    httpService;
    configService;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    get aiEngineUrl() {
        return this.configService.aiEngineUrl;
    }
    async getChatResponse(message, chatHistory = []) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.aiEngineUrl}/chat`, {
                message,
                chat_history: chatHistory,
            }));
            return response.data.response;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to get chat response from AI engine', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDailyContent() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.aiEngineUrl}/daily-content`));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to get daily content from AI engine', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPrediction(inputText, parameters = {}) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.aiEngineUrl}/predict`, {
                input_text: inputText,
                parameters,
            }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to get prediction from AI engine', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async searchContent(query, filters = {}) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.aiEngineUrl}/search`, {
                query,
                filters,
            }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to search content from AI engine', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_service_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map