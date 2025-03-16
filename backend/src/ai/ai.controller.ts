import { Controller, Post, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
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

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async getChatResponse(@Body() chatRequestDto: ChatRequestDto) {
    try {
      const response = await this.aiService.getChatResponse(
        chatRequestDto.message,
        chatRequestDto.chat_history,
      );
      
      // Return the response in a format that matches what the frontend expects
      return { response };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get chat response',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('daily-content')
  async getDailyContent() {
    try {
      return await this.aiService.getDailyContent();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get daily content',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('predict')
  async getPrediction(@Body() predictionRequestDto: PredictionRequestDto) {
    try {
      return await this.aiService.getPrediction(
        predictionRequestDto.input_text,
        predictionRequestDto.parameters,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get prediction',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('search')
  async searchContent(@Body() searchRequestDto: SearchRequestDto) {
    try {
      return await this.aiService.searchContent(
        searchRequestDto.query,
        searchRequestDto.filters,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to search content',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}