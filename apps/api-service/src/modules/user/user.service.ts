import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities';
import { Repository } from 'typeorm';
import {
  CreateUserInputDto,
  CreateUserResponseDto,
} from '@node-challenge/dtos';
import * as crypto from 'crypto';
import { hash, genSalt } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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

  private async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
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

    const saltRounds = 10;
    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(password, salt);

    return {
      password,
      hash: hashedPassword,
    };
  }
}
