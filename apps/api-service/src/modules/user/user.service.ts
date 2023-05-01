import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities';
import { FindOneOptions, Repository } from 'typeorm';
import {
  CreateUserInputDto,
  CreateUserResponseDto,
} from '@node-challenge/dtos';
import * as crypto from 'crypto';
import { hash, genSalt } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async register(
    user: CreateUserInputDto,
  ): Promise<CreateUserResponseDto> {
    if (await this.getUserByEmail(user.email)) {
      throw new BadRequestException('User already exists');
    }

    const { hash, password } = await this.generatePassword();

    const newUser = this.userRepository.create({
      email: user.email,
      role: user.role,
      password: hash,
    });

    const createdUser = await this.userRepository.save(newUser);

    return {
      email: createdUser.email,
      password,
    };
  }

  public async getUserOrThrow(options: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOneOrFail(options);
  }

  public async getUser(options: FindOneOptions<User>): Promise<User> {
    return await this.userRepository.findOne(options);
  }

  public async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.userRepository.update(
      { id: userId },
      { refreshToken: refreshToken },
    );
  }

  public async updateRecoveryPassword(
    userId: string,
    resetPasswordToken: string,
    resetPasswordExpires: Date,
  ): Promise<void> {
    await this.userRepository.update(
      { id: userId },
      {
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpires: resetPasswordExpires,
      },
    );
  }

  public async updateResetPassword(
    userId: string,
    resetPasswordToken: string,
    resetPasswordExpires: Date,
    password: string,
  ): Promise<void> {
    const hashedPassword = await this.hashPassword(password);

    await this.userRepository.update(
      { id: userId },
      {
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpires: resetPasswordExpires,
        password: hashedPassword,
      },
    );
  }

  private async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  private async generatePassword(): Promise<{
    password: string;
    hash: string;
  }> {
    const password = crypto.randomBytes(16).toString('hex');

    const hashedPassword = await this.hashPassword(password);

    return {
      password,
      hash: hashedPassword,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(password, salt);

    return hashedPassword;
  }
}
