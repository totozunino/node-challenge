import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export class CreateUserInputDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty()
  @IsEnum(UserRole)
  @IsNotEmpty()
  public role: UserRole;
}
