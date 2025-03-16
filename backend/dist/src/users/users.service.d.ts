import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UpdatePreferencesDto, UserResponseDto } from './dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findUserById(id: string): Promise<UserResponseDto>;
    findUserByEmail(email: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string;
        password: string;
    } | null>;
    createUser(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    updatePreferences(id: string, updatePreferencesDto: UpdatePreferencesDto): Promise<UserResponseDto>;
    deleteUser(id: string): Promise<{
        success: boolean;
    }>;
}
