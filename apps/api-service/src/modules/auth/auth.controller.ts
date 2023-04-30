import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @HttpCode(HttpStatus.OK)
  public async login(@Body() body: LoginInputDto): Promise<LoginResponseDto> {
    return await this.authService.login(body);
  }

  @ApiBearerAuth()
  @Post('/refresh-token')
  @HttpCode(HttpStatus.OK)
  public async refreshToken(
    @User('sub') userId: string,
    @Body() body: RefreshTokenInputDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.refreshToken(userId, body);
  }

  @ApiBearerAuth()
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  public async logout(@User('sub') userId: string): Promise<void> {
    await this.authService.logout(userId);
  }
}