import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  LoginInputDto,
  LoginResponseDto,
  RefreshTokenInputDto,
} from '@node-challenge/dtos';
import { UserService } from '../user/user.service';
import { compare, genSalt, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async login(loginInputDto: LoginInputDto): Promise<LoginResponseDto> {
    const { email, password } = loginInputDto;

    const user = await this.userService.getUserOrThrow({ where: { email } });

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async logout(userId: string): Promise<void> {
    await this.userService.updateRefreshToken(userId, null);
  }

  public async refreshToken(
    userId: string,
    refreshTokenInput: RefreshTokenInputDto,
  ): Promise<LoginResponseDto> {
    const user = await this.userService.getUserOrThrow({
      where: { id: userId },
    });

    if (!(await compare(refreshTokenInput.refreshToken, user.refreshToken))) {
      throw new ForbiddenException('Access denied');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  private generateAccessToken(user: User): string {
    const accessToken = this.jwtService.sign(
      {
        email: user.email,
        sub: user.id,
      },
      { expiresIn: '5m' },
    );
    return accessToken;
  }

  private async generateRefreshToken(user: User): Promise<string> {
    const refreshToken = this.jwtService.sign(
      {
        email: user.email,
        sub: user.id,
      },
      { expiresIn: '7d' },
    );

    const saltRounds = 10;
    const salt = await genSalt(saltRounds);
    const hashedToken = await hash(refreshToken, salt);

    await this.userService.updateRefreshToken(user.id, hashedToken);

    return refreshToken;
  }
}
