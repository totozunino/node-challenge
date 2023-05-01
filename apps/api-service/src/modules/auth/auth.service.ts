import {
  BadRequestException,
  ForbiddenException,
  Inject,
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
import * as crypto from 'crypto';
import { User } from '../../entities';
import { MailService } from '../mail/mail.service';
import mailConfig from '../../config/mail.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @Inject(mailConfig.KEY)
    private readonly mailConfiguration: ConfigType<typeof mailConfig>,
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

  public async sendPasswordRecoveryEmail(email: string): Promise<string> {
    const user = await this.userService.getUser({ where: { email } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const token = crypto.randomBytes(16).toString('hex');

    const ONE_HOUR_MS = 3_600_000;

    await this.userService.updateRecoveryPassword(
      user.id,
      token,
      new Date(Date.now() + ONE_HOUR_MS),
    );

    // Here we creating the reset link with the token
    const resetLink = `${this.mailConfiguration.resetLinkUrl}/reset-password?token=${token}`;

    await this.mailService.sendMail({
      to: user.email,
      subject: 'Password Reset',
      template: './password-reset',
      context: {
        resetLink,
      },
    });

    // Here we are returning the token for testing purposes, but in a real scenario we should use a third party service to send the email.
    // The user should get an email with the reset link so he can reset his password.
    return token;
  }

  public async resetPassword(token: string, password: string): Promise<void> {
    const user = await this.userService.getUser({
      where: { resetPasswordToken: token },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const ONE_HOUR_MS = 3_600_000;
    if (Date.now() > user.resetPasswordExpires.getTime() + ONE_HOUR_MS) {
      throw new UnauthorizedException();
    }

    await this.userService.updateResetPassword(user.id, null, null, password);
  }

  private generateAccessToken(user: User): string {
    const accessToken = this.jwtService.sign(
      {
        email: user.email,
        sub: user.id,
        role: user.role,
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
        role: user.role,
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
