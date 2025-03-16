import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentResponseDto } from './dto/content-response.dto';
export declare class ContentService {
    private prisma;
    private aiService;
    constructor(prisma: PrismaService, aiService: AiService);
    getRecommendedContent(userId: string): Promise<any[]>;
    getFeaturedContent(): Promise<any[]>;
    searchContent(query: string | undefined, filters?: any): Promise<{
        results: any[];
    }>;
    getContentById(id: string): Promise<any>;
    saveContent(userId: string, contentId: string): Promise<{
        success: boolean;
        savedContent: any;
    }>;
    unsaveContent(userId: string, contentId: string): Promise<{
        success: boolean;
    }>;
    createContent(userId: string, createContentDto: CreateContentDto): Promise<ContentResponseDto>;
    updateContent(id: string, userId: string, updateContentDto: UpdateContentDto): Promise<ContentResponseDto>;
}
