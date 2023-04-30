import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StockHistory } from '../../../entities';
import {
  buildMockedStock,
  buildMockedUser,
  mockRepository,
} from '../../../../test/utils';
import Chance from 'chance';
import { StockService } from '../stock.service';
import stockServiceConfig from '../../../config/stock-service.config';
import { UserService } from '../../user/user.service';
import axios from 'axios';

const chance = new Chance();

jest.mock('../../user/user.service');
jest.mock('axios');

describe('Stock Service', () => {
  let stockService: StockService;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        StockService,
        UserService,
        {
          provide: getRepositoryToken(StockHistory),
          useValue: mockRepository,
        },
        {
          provide: stockServiceConfig.KEY,
          useValue: {
            url: chance.url(),
          },
        },
      ],
    }).compile();

    stockService = app.get<StockService>(StockService);
    userService = app.get(UserService);
  });

  describe('Get stock', () => {
    it('should return a stock successfully', async () => {
      const userId = chance.guid();
      const stockCode = chance.string();

      const mockedUser = buildMockedUser({ id: userId });

      const mockedStock = buildMockedStock();

      (axios.get as jest.Mock).mockResolvedValue({
        data: mockedStock,
      });

      userService.getUserOrThrow.mockResolvedValue(mockedUser);
      mockRepository.create.mockReturnValue(mockedStock);
      mockRepository.save.mockReturnValue(Promise.resolve(mockedStock));

      await stockService.getStock(stockCode, userId);

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledWith({
        close: mockedStock.close,
        high: mockedStock.high,
        low: mockedStock.low,
        name: mockedStock.name,
        open: mockedStock.open,
        symbol: mockedStock.symbol,
        date: new Date(mockedStock.date + ' ' + mockedStock.time),
        user: mockedUser,
      });
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledWith(mockedStock);
    });

    it('should throw an error if the user does not exist', async () => {
      const userId = chance.guid();
      const stockCode = chance.string();

      userService.getUserOrThrow.mockRejectedValue(new Error('User not found'));

      await expect(stockService.getStock(stockCode, userId)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('Get stock history', () => {
    it('should return a stock history successfully', async () => {
      const userId = chance.guid();

      const mockedStock = buildMockedStock();

      mockRepository.find.mockReturnValue(Promise.resolve([mockedStock]));

      const result = await stockService.getStockHistory(userId);

      expect(mockRepository.find).toHaveBeenCalledTimes(1);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          user: {
            id: userId,
          },
        },
        order: {
          createdAt: 'DESC',
        },
      });

      expect(result).toMatchObject([
        {
          name: mockedStock.name,
          symbol: mockedStock.symbol,
          open: mockedStock.open,
          high: mockedStock.high,
          low: mockedStock.low,
          close: mockedStock.close,
        },
      ]);
    });
  });
  describe('Get stock stats', () => {
    it('should return a stock stats successfully', async () => {
      const mockedStock = buildMockedStock();

      mockRepository.createQueryBuilder = jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockReturnValue([mockedStock]),
      }));

      const result = await stockService.getStockStats();

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledTimes(1);

      expect(result).toHaveLength(1);
    });
  });
});
