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
exports.ContentController = void 0;
const common_1 = require("@nestjs/common");
const content_service_1 = require("./content.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const dto_1 = require("./dto");
let ContentController = class ContentController {
    contentService;
    constructor(contentService) {
        this.contentService = contentService;
    }
    async getFeaturedContent() {
        try {
            return await this.contentService.getFeaturedContent();
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to get featured content', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRecommendedContent(req) {
        try {
            return await this.contentService.getRecommendedContent(req.user.id);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to get recommended content', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getContentById(id) {
        try {
            return await this.contentService.getContentById(id);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to get content', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async searchContent(searchDto) {
        try {
            return await this.contentService.searchContent(searchDto.query, searchDto.filters);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to search content', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async saveContent(req, body) {
        try {
            return await this.contentService.saveContent(req.user.id, body.contentId);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to save content', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async unsaveContent(req, contentId) {
        try {
            return await this.contentService.unsaveContent(req.user.id, contentId);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to unsave content', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ContentController = ContentController;
__decorate([
    (0, common_1.Get)('featured'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getFeaturedContent", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('recommended'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getRecommendedContent", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getContentById", null);
__decorate([
    (0, common_1.Post)('search'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SearchDto]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "searchContent", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('save'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "saveContent", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('save/:contentId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('contentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "unsaveContent", null);
exports.ContentController = ContentController = __decorate([
    (0, common_1.Controller)('content'),
    __metadata("design:paramtypes", [content_service_1.ContentService])
], ContentController);
//# sourceMappingURL=content.controller.js.map