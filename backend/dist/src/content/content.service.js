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
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_service_1 = require("../ai/ai.service");
const content_response_dto_1 = require("./dto/content-response.dto");
let ContentService = class ContentService {
    prisma;
    aiService;
    constructor(prisma, aiService) {
        this.prisma = prisma;
        this.aiService = aiService;
    }
    async getRecommendedContent(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: { preferences: true },
            });
            if (!user) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            const content = await this.prisma.content.findMany({
                where: {
                    tags: {
                        hasSome: user.preferences?.preferredTopics || [],
                    },
                },
                take: 5,
                orderBy: { createdAt: 'desc' },
            });
            return content;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to get recommended content', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getFeaturedContent() {
        try {
            const content = await this.prisma.content.findMany({
                where: {
                    featured: true,
                },
                take: 5,
                orderBy: { createdAt: 'desc' },
            });
            return content;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to get featured content', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async searchContent(query, filters = {}) {
        try {
            const where = {};
            let searchResults;
            if (filters.type &&
                Array.isArray(filters.type) &&
                filters.type.length > 0) {
                where.type = {
                    in: filters.type,
                };
            }
            if (filters.topic &&
                Array.isArray(filters.topic) &&
                filters.topic.length > 0) {
                where.tags = {
                    hasSome: filters.topic,
                };
            }
            if (query && query.trim() !== '') {
                searchResults = await this.aiService.searchContent(query, filters);
                if (!searchResults ||
                    !searchResults.results ||
                    !Array.isArray(searchResults.results)) {
                    return { results: [] };
                }
                const contentIds = searchResults.results.map((result) => result.id);
                if (contentIds.length > 0) {
                    where.id = {
                        in: contentIds,
                    };
                }
                else {
                    return { results: [] };
                }
            }
            const content = await this.prisma.content.findMany({
                where,
                include: { author: true },
                orderBy: { createdAt: 'desc' },
                take: 20,
            });
            if (query && query.trim() !== '' && searchResults) {
                const enrichedResults = await Promise.all(searchResults.results.map(async (result) => {
                    const dbContent = content.find((c) => c.id === result.id);
                    return dbContent
                        ? {
                            ...result,
                            ...dbContent,
                            author: dbContent.author || null,
                            createdAt: dbContent.createdAt || null,
                        }
                        : null;
                }));
                return { results: enrichedResults.filter(Boolean) };
            }
            return { results: content };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to search content', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getContentById(id) {
        try {
            const content = await this.prisma.content.findUnique({
                where: { id },
                include: { author: true },
            });
            if (!content) {
                throw new common_1.HttpException('Content not found', common_1.HttpStatus.NOT_FOUND);
            }
            return content;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to get content', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async saveContent(userId, contentId) {
        try {
            const content = await this.prisma.content.findUnique({
                where: { id: contentId },
            });
            if (!content) {
                throw new common_1.HttpException('Content not found', common_1.HttpStatus.NOT_FOUND);
            }
            const savedContent = await this.prisma.savedContent.create({
                data: {
                    userId,
                    contentId,
                },
            });
            return { success: true, savedContent };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to save content', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async unsaveContent(userId, contentId) {
        try {
            const savedContent = await this.prisma.savedContent.findUnique({
                where: {
                    userId_contentId: {
                        userId,
                        contentId,
                    },
                },
            });
            if (!savedContent) {
                return { success: false };
            }
            await this.prisma.savedContent.delete({
                where: {
                    userId_contentId: {
                        userId,
                        contentId,
                    },
                },
            });
            return { success: true };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to unsave content', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createContent(userId, createContentDto) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            const content = await this.prisma.content.create({
                data: {
                    ...createContentDto,
                    authorId: userId,
                },
                include: { author: true },
            });
            return new content_response_dto_1.ContentResponseDto(content);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to create content', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateContent(id, userId, updateContentDto) {
        try {
            const content = await this.prisma.content.findUnique({
                where: { id },
            });
            if (!content) {
                throw new common_1.HttpException('Content not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (content.authorId !== userId) {
                throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
            }
            const updatedContent = await this.prisma.content.update({
                where: { id },
                data: updateContentDto,
                include: { author: true },
            });
            return new content_response_dto_1.ContentResponseDto(updatedContent);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to update content', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService])
], ContentService);
//# sourceMappingURL=content.service.js.map