import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserInputDto,
  CreateUserResponseDto,
} from '@node-challenge/dtos';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Register user',
    description: `It creates a new user and returns the user's data`,
  })
  @ApiResponse({ type: CreateUserResponseDto })
  public async register(
    @Body() body: CreateUserInputDto,
  ): Promise<CreateUserResponseDto> {
    return await this.userService.register(body);
  }
}
