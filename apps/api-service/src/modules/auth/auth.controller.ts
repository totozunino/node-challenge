import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  LoginInputDto,
  LoginResponseDto,
  PasswordRecoveryInputDto,
  PasswordRecoveryResponseDto,
  RefreshTokenInputDto,
  ResetPasswordInputDto,
  ResetPasswordResponseDto,
} from '@node-challenge/dtos';
import { AuthService } from './auth.service';
import { Public, User } from './decorators';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  @ApiResponse({ type: LoginResponseDto })
  @ApiOperation({
    summary: 'Login',
    description: `Login in user and return tokens`,
  })
  @HttpCode(HttpStatus.OK)
  public async login(@Body() body: LoginInputDto): Promise<LoginResponseDto> {
    return await this.authService.login(body);
  }

  @Public()
  @Post('/refresh-token')
  @ApiResponse({ type: LoginResponseDto })
  @ApiOperation({
    summary: 'Refresh Token',
    description: `If access token is expired, use refresh token to get new access token`,
  })
  @HttpCode(HttpStatus.OK)
  public async refreshToken(
    @User('sub') userId: string,
    @Body() body: RefreshTokenInputDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.refreshToken(userId, body);
  }

  @ApiBearerAuth()
  @Post('/logout')
  @ApiOperation({
    summary: 'Logout',
    description: `Logout user and invalidate refresh token`,
  })
  @HttpCode(HttpStatus.OK)
  public async logout(@User('sub') userId: string): Promise<void> {
    await this.authService.logout(userId);
  }

  @Public()
  @Post('/password-recovery')
  @ApiOperation({
    summary: 'Password recovery',
    description: 'Send password recovery email',
  })
  public async recoverPassword(
    @Body() body: PasswordRecoveryInputDto,
  ): Promise<PasswordRecoveryResponseDto> {
    const { email } = body;
    const token = await this.authService.sendPasswordRecoveryEmail(email);
    return { message: 'Password recovery email sent', token };
  }

  @Public()
  @Post('/reset-password')
  @ApiOperation({ summary: 'Reset password', description: 'Reset password' })
  public async resetPassword(
    @Body() body: ResetPasswordInputDto,
  ): Promise<ResetPasswordResponseDto> {
    const { token, password } = body;
    await this.authService.resetPassword(token, password);
    return { message: 'Password reset successfully' };
  }
}
