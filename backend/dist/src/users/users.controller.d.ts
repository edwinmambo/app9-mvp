import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UpdatePreferencesDto } from './dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getCurrentUser(req: any): Promise<import("./dto").UserResponseDto>;
    getUserById(id: string): Promise<import("./dto").UserResponseDto>;
    createUser(createUserDto: CreateUserDto): Promise<import("./dto").UserResponseDto>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<import("./dto").UserResponseDto>;
    updatePreferences(id: string, updatePreferencesDto: UpdatePreferencesDto): Promise<import("./dto").UserResponseDto>;
    deleteUser(id: string): Promise<{
        success: boolean;
    }>;
}
