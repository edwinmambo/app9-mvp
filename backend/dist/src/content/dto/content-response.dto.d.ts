import { UserResponseDto } from '../../users/dto';
export declare class ContentResponseDto {
    id: string;
    title: string;
    description: string | null;
    content: string;
    tags: string[];
    featured: boolean;
    author: UserResponseDto | null;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<ContentResponseDto>);
}
