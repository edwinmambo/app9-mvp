import { HttpService } from '@nestjs/axios';
import { ConfigService } from '../config/config.service';
export declare class AiService {
    private httpService;
    private configService;
    constructor(httpService: HttpService, configService: ConfigService);
    private get aiEngineUrl();
    getChatResponse(message: string, chatHistory?: any[]): Promise<string>;
    getDailyContent(): Promise<any>;
    getPrediction(inputText: string, parameters?: any): Promise<any>;
    searchContent(query: string, filters?: any): Promise<any>;
}
