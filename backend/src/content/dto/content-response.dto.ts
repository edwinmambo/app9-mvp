import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto';

export class ContentResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string | null;

  @Expose()
  content: string;

  @Expose()
  tags: string[];

  @Expose()
  featured: boolean;

  @Expose()
  @Type(() => UserResponseDto)
  author: UserResponseDto | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<ContentResponseDto>) {
    Object.assign(this, partial);
  }
}