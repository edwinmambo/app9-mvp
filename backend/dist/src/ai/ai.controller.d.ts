import { AiService } from './ai.service';
interface ChatRequestDto {
    message: string;
    chat_history?: any[];
}
interface SearchRequestDto {
    query: string;
    filters?: any;
}
interface PredictionRequestDto {
    input_text: string;
    parameters?: any;
}
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    getChatResponse(chatRequestDto: ChatRequestDto): Promise<{
        response: string;
    }>;
    getDailyContent(): Promise<any>;
    getPrediction(predictionRequestDto: PredictionRequestDto): Promise<any>;
    searchContent(searchRequestDto: SearchRequestDto): Promise<any>;
}
export {};
