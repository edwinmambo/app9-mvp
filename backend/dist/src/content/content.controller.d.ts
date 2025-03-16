import { ContentService } from './content.service';
import { SearchDto } from './dto';
export declare class ContentController {
    private contentService;
    constructor(contentService: ContentService);
    getFeaturedContent(): Promise<any[]>;
    getRecommendedContent(req: any): Promise<any[]>;
    getContentById(id: string): Promise<any>;
    searchContent(searchDto: SearchDto): Promise<{
        results: any[];
    }>;
    saveContent(req: any, body: {
        contentId: string;
    }): Promise<{
        success: boolean;
        savedContent: any;
    }>;
    unsaveContent(req: any, contentId: string): Promise<{
        success: boolean;
    }>;
}
