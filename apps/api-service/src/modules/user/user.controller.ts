import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserInputDto,
  CreateUserResponseDto,
} from '@node-challenge/dtos';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @ApiResponse({ type: CreateUserResponseDto })
  public async register(
    @Body() body: CreateUserInputDto,
  ): Promise<CreateUserResponseDto> {
    return await this.usersService.register(body);
  }
}
