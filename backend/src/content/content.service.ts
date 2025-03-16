import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentResponseDto } from './dto/content-response.dto';

@Injectable()
export class ContentService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async getRecommendedContent(userId: string): Promise<any[]> {
    try {
      // Get user preferences from database
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { preferences: true },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Get content from database based on user preferences
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get recommended content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getFeaturedContent(): Promise<any[]> {
    try {
      // Get featured content from database
      const content = await this.prisma.content.findMany({
        where: {
          featured: true,
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
      });

      return content;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get featured content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchContent(
    query: string | undefined,
    filters: any = {},
  ): Promise<{ results: any[] }> {
    try {
      // Build where clause based on filters
      const where: any = {};
      let searchResults: any;

      // Handle type filter
      if (
        filters.type &&
        Array.isArray(filters.type) &&
        filters.type.length > 0
      ) {
        where.type = {
          in: filters.type,
        };
      }

      // Handle topic/tag filter
      if (
        filters.topic &&
        Array.isArray(filters.topic) &&
        filters.topic.length > 0
      ) {
        where.tags = {
          hasSome: filters.topic,
        };
      }

      // If there's a search query, use AI service for semantic search
      if (query && query.trim() !== '') {
        searchResults = await this.aiService.searchContent(query, filters);

        if (
          !searchResults ||
          !searchResults.results ||
          !Array.isArray(searchResults.results)
        ) {
          return { results: [] };
        }

        // Get IDs from AI search results
        const contentIds = searchResults.results.map((result) => result.id);

        // Add content IDs to where clause
        if (contentIds.length > 0) {
          where.id = {
            in: contentIds,
          };
        } else {
          // If AI search returned no results, return empty array
          return { results: [] };
        }
      }

      // Perform database search with filters
      const content = await this.prisma.content.findMany({
        where,
        include: { author: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      // If using AI search, maintain the order from AI results
      if (query && query.trim() !== '' && searchResults) {
        // Enrich search results with additional data from database
        const enrichedResults = await Promise.all(
          searchResults.results.map(async (result) => {
            const dbContent = content.find((c) => c.id === result.id);
            return dbContent
              ? {
                  ...result,
                  ...dbContent,
                  author: dbContent.author || null,
                  createdAt: dbContent.createdAt || null,
                }
              : null;
          }),
        );

        return { results: enrichedResults.filter(Boolean) };
      }

      // Return direct database results
      return { results: content };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to search content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getContentById(id: string): Promise<any> {
    try {
      const content = await this.prisma.content.findUnique({
        where: { id },
        include: { author: true },
      });

      if (!content) {
        throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
      }

      return content;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async saveContent(
    userId: string,
    contentId: string,
  ): Promise<{ success: boolean; savedContent: any }> {
    try {
      // Check if content exists
      const content = await this.prisma.content.findUnique({
        where: { id: contentId },
      });

      if (!content) {
        throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
      }

      // Save content for user
      const savedContent = await this.prisma.savedContent.create({
        data: {
          userId,
          contentId,
        },
      });

      return { success: true, savedContent };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to save content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async unsaveContent(
    userId: string,
    contentId: string,
  ): Promise<{ success: boolean }> {
    try {
      // Check if the saved content exists
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

      // Delete saved content record
      await this.prisma.savedContent.delete({
        where: {
          userId_contentId: {
            userId,
            contentId,
          },
        },
      });

      return { success: true };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to unsave content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createContent(
    userId: string,
    createContentDto: CreateContentDto,
  ): Promise<ContentResponseDto> {
    try {
      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Create content
      const content = await this.prisma.content.create({
        data: {
          ...createContentDto,
          authorId: userId,
        },
        include: { author: true },
      });

      return new ContentResponseDto(content);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateContent(
    id: string,
    userId: string,
    updateContentDto: UpdateContentDto,
  ): Promise<ContentResponseDto> {
    try {
      // Check if content exists and belongs to user
      const content = await this.prisma.content.findUnique({
        where: { id },
      });

      if (!content) {
        throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
      }

      if (content.authorId !== userId) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      // Update content
      const updatedContent = await this.prisma.content.update({
        where: { id },
        data: updateContentDto,
        include: { author: true },
      });

      return new ContentResponseDto(updatedContent);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
