import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserRole } from '@node-challenge/dtos';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles);
