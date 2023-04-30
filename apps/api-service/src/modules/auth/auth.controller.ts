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
  RefreshTokenInputDto,
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

  @ApiBearerAuth()
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
}
