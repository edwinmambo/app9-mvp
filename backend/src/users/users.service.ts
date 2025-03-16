import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UpdatePreferencesDto, UserResponseDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findUserById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { preferences: true },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return new UserResponseDto(user);
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, password, name, preferredTopics } = createUserDto;

    // Check if user already exists
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with preferences if provided
    const userData: any = {
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

    return new UserResponseDto(newUser);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    // Check if user exists
    await this.findUserById(id);

    const { password, ...userData } = updateUserDto;

    // If password is provided, hash it
    if (password) {
      userData['password'] = await bcrypt.hash(password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: userData,
      include: { preferences: true },
    });

    return new UserResponseDto(updatedUser);
  }

  async updatePreferences(id: string, updatePreferencesDto: UpdatePreferencesDto) {
    // Check if user exists
    await this.findUserById(id);

    // Check if preferences exist, create if not
    const preferences = await this.prisma.userPreference.findUnique({
      where: { userId: id },
    });

    if (preferences) {
      // Update existing preferences
      await this.prisma.userPreference.update({
        where: { userId: id },
        data: {
          preferredTopics: updatePreferencesDto.preferredTopics,
        },
      });
    } else {
      // Create new preferences
      await this.prisma.userPreference.create({
        data: {
          userId: id,
          preferredTopics: updatePreferencesDto.preferredTopics,
        },
      });
    }

    // Return updated user with preferences
    return this.findUserById(id);
  }

  async deleteUser(id: string) {
    // Check if user exists
    await this.findUserById(id);

    // Delete user
    await this.prisma.user.delete({
      where: { id },
    });

    return { success: true };
  }
}