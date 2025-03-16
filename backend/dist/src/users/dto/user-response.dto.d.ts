export declare class UserResponseDto {
    id: string;
    email: string;
    name: string | null;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<UserResponseDto>);
}
