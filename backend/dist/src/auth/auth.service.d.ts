import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(loginDto: any): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string | null;
        };
    }>;
    register(registerDto: any): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string | null;
        };
    }>;
}
