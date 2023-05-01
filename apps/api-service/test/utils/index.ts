import { StockDto, UserRole } from '@node-challenge/dtos';
import { Stock, StockHistory, User } from '../../src/entities';
import Chance from 'chance';

const chance = new Chance();

export const buildMockedUser = (attrs?: Partial<User>): User => {
  return {
    createdAt: new Date(),
    email: chance.email(),
    id: chance.guid(),
    password: chance.hash(),
    role: chance.pickone(Object.values(UserRole)),
    updatedAt: new Date(),
    stockHistory: null,
    refreshToken: null,
    resetPasswordExpires: null,
    resetPasswordToken: null,
    ...attrs,
  };
};

export const buildMockedStock = (attrs?: Partial<Stock>): Stock => {
  return {
    createdAt: new Date(),
    id: chance.guid(),
    name: chance.string(),
    symbol: chance.string(),
    stockHistory: null,
    updatedAt: new Date(),
    ...attrs,
  };
};

export const buildMockedStockHistory = (
  attrs?: Partial<StockHistory>,
): StockHistory => {
  return {
    createdAt: new Date(),
    id: chance.guid(),
    updatedAt: new Date(),
    close: chance.floating(),
    date: new Date(),
    high: chance.floating(),
    low: chance.floating(),
    open: chance.floating(),
    stock: null,
    user: null,
    ...attrs,
  };
};

export const buildMockedStockDto = (attrs?: Partial<StockDto>): StockDto => {
  return {
    close: chance.floating(),
    date: '2021-10-10',
    high: chance.floating(),
    low: chance.floating(),
    name: chance.string(),
    open: chance.floating(),
    symbol: chance.string(),
    time: '20:00:00',
    volume: chance.integer(),
    ...attrs,
  };
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  findOneOrFail: jest.fn(),
  update: jest.fn(),
  find: jest.fn(),
  createQueryBuilder: jest.fn(),
});
