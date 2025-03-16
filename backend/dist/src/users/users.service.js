"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const dto_1 = require("./dto");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findUserById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { preferences: true },
        });
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        return new dto_1.UserResponseDto(user);
    }
    async findUserByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async createUser(createUserDto) {
        const { email, password, name, preferredTopics } = createUserDto;
        const existingUser = await this.findUserByEmail(email);
        if (existingUser) {
            throw new common_1.HttpException('User with this email already exists', common_1.HttpStatus.BAD_REQUEST);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = {
            email,
            password: hashedPassword,
            name,
        };
        if (preferredTopics && preferredTopics.length > 0) {
            userData.preferences = {
                create: {
                    preferredTopics,
                },
            };
        }
        const newUser = await this.prisma.user.create({
            data: userData,
            include: { preferences: true },
        });
        return new dto_1.UserResponseDto(newUser);
    }
    async updateUser(id, updateUserDto) {
        await this.findUserById(id);
        const { password, ...userData } = updateUserDto;
        if (password) {
            userData['password'] = await bcrypt.hash(password, 10);
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: userData,
            include: { preferences: true },
        });
        return new dto_1.UserResponseDto(updatedUser);
    }
    async updatePreferences(id, updatePreferencesDto) {
        await this.findUserById(id);
        const preferences = await this.prisma.userPreference.findUnique({
            where: { userId: id },
        });
        if (preferences) {
            await this.prisma.userPreference.update({
                where: { userId: id },
                data: {
                    preferredTopics: updatePreferencesDto.preferredTopics,
                },
            });
        }
        else {
            await this.prisma.userPreference.create({
                data: {
                    userId: id,
                    preferredTopics: updatePreferencesDto.preferredTopics,
                },
            });
        }
        return this.findUserById(id);
    }
    async deleteUser(id) {
        await this.findUserById(id);
        await this.prisma.user.delete({
            where: { id },
        });
        return { success: true };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map