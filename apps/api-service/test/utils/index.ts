import { UserRole } from '@node-challenge/dtos';
import { User } from '../../src/entities';
import Chance from 'chance';

const chance = new Chance();

export const buildMockedUser = (attrs: Partial<User>): User => {
  return {
    createdAt: new Date(),
    email: chance.email(),
    id: chance.guid(),
    password: chance.hash(),
    role: chance.pickone(Object.values(UserRole)),
    updatedAt: new Date(),
    stockHistory: null,
    refreshToken: null,
    ...attrs,
  };
};
export const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  findOneOrFail: jest.fn(),
  update: jest.fn(),
};
