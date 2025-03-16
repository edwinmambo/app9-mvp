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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
let AiController = class AiController {
    aiService;
    constructor(aiService) {
        this.aiService = aiService;
    }
    async getChatResponse(chatRequestDto) {
        try {
            const response = await this.aiService.getChatResponse(chatRequestDto.message, chatRequestDto.chat_history);
            return { response };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to get chat response', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDailyContent() {
        try {
            return await this.aiService.getDailyContent();
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to get daily content', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPrediction(predictionRequestDto) {
        try {
            return await this.aiService.getPrediction(predictionRequestDto.input_text, predictionRequestDto.parameters);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to get prediction', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async searchContent(searchRequestDto) {
        try {
            return await this.aiService.searchContent(searchRequestDto.query, searchRequestDto.filters);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to search content', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('chat'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getChatResponse", null);
__decorate([
    (0, common_1.Get)('daily-content'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getDailyContent", null);
__decorate([
    (0, common_1.Post)('predict'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getPrediction", null);
__decorate([
    (0, common_1.Post)('search'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "searchContent", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map