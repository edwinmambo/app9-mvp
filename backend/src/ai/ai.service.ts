import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AiService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {}

  private get aiEngineUrl(): string {
    return this.configService.aiEngineUrl;
  }

  async getChatResponse(
    message: string,
    chatHistory: any[] = [],
  ): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.aiEngineUrl}/chat`, {
          message,
          chat_history: chatHistory,
        }),
      );
      return response.data.response;
    } catch (error) {
      throw new HttpException(
        'Failed to get chat response from AI engine',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getDailyContent(): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.aiEngineUrl}/daily-content`),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to get daily content from AI engine',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPrediction(inputText: string, parameters: any = {}): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.aiEngineUrl}/predict`, {
          input_text: inputText,
          parameters,
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to get prediction from AI engine',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchContent(query: string, filters: any = {}): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.aiEngineUrl}/search`, {
          query,
          filters,
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to search content from AI engine',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
