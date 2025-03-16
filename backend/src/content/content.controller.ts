import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SearchDto } from './dto';

@Controller('content')
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Get('featured')
  async getFeaturedContent() {
    try {
      return await this.contentService.getFeaturedContent();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get featured content',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('recommended')
  async getRecommendedContent(@Request() req) {
    try {
      return await this.contentService.getRecommendedContent(req.user.id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get recommended content',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async getContentById(@Param('id') id: string) {
    try {
      return await this.contentService.getContentById(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get content',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('search')
  async searchContent(@Body() searchDto: SearchDto) {
    try {
      return await this.contentService.searchContent(searchDto.query, searchDto.filters);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to search content',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('save')
  async saveContent(@Request() req, @Body() body: { contentId: string }) {
    try {
      return await this.contentService.saveContent(req.user.id, body.contentId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to save content',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('save/:contentId')
  async unsaveContent(@Request() req, @Param('contentId') contentId: string) {
    try {
      return await this.contentService.unsaveContent(req.user.id, contentId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to unsave content',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}