import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Stock, StockHistory } from '../../../entities';
import {
  buildMockedStock,
  buildMockedStockDto,
  buildMockedStockHistory,
  buildMockedUser,
  mockEntityManager,
  mockRepository,
} from '../../../../test/utils';
import Chance from 'chance';
import { StockService } from '../stock.service';
import stockServiceConfig from '../../../config/stock-service.config';
import { UserService } from '../../user/user.service';
import axios from 'axios';
import { UnauthorizedException } from '@nestjs/common';

const chance = new Chance();

jest.mock('../../user/user.service');
jest.mock('axios');

describe('Stock Service', () => {
  let stockService: StockService;
  let userService: jest.Mocked<UserService>;
  const mockedStockRepository = mockRepository();
  const mockedStockHistoryRepository = mockRepository();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        StockService,
        UserService,
        {
          provide: getRepositoryToken(StockHistory),
          useValue: mockedStockHistoryRepository,
        },
        {
          provide: getRepositoryToken(Stock),
          useValue: mockedStockRepository,
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Get stock', () => {
    it('should return a stock successfully', async () => {
      const userId = chance.guid();
      const stockCode = chance.string();

      const mockedUser = buildMockedUser({ id: userId });
      const mockedStock = buildMockedStock({
        symbol: stockCode,
      });
      const mockedStockDto = buildMockedStockDto();
      const mockedStockHistory = buildMockedStockHistory({
        user: mockedUser,
        stock: mockedStock,
      });

      (axios.get as jest.Mock).mockResolvedValue({
        data: mockedStockDto,
      });

      userService.getUser.mockResolvedValue(mockedUser);
      mockEntityManager.findOne.mockReturnValue(Promise.resolve(mockedStock));

      mockedStockHistoryRepository.create.mockReturnValue(mockedStockHistory);
      mockedStockHistoryRepository.save.mockReturnValue(
        Promise.resolve(mockedStockHistory),
      );

      await stockService.getStock(stockCode, userId);

      expect(mockEntityManager.findOne).toHaveBeenCalledTimes(1);
      expect(mockEntityManager.findOne).toHaveBeenCalledWith(Stock, {
        where: {
          symbol: mockedStockDto.symbol,
        },
      });

      expect(mockedStockHistoryRepository.create).toHaveBeenCalledTimes(1);
      expect(mockedStockHistoryRepository.create).toHaveBeenCalledWith({
        close: mockedStockDto.close,
        high: mockedStockDto.high,
        low: mockedStockDto.low,
        open: mockedStockDto.open,
        date: new Date(mockedStockDto.date + ' ' + mockedStockDto.time),
        user: mockedUser,
        stock: mockedStock,
      });
      expect(mockedStockHistoryRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should create a new stock if it does not exist', async () => {
      const userId = chance.guid();
      const stockCode = chance.string();

      const mockedUser = buildMockedUser({ id: userId });
      const mockedStock = buildMockedStock({
        symbol: stockCode,
      });
      const mockedStockDto = buildMockedStockDto();
      const mockedStockHistory = buildMockedStockHistory({
        user: mockedUser,
        stock: mockedStock,
      });

      (axios.get as jest.Mock).mockResolvedValue({
        data: mockedStockDto,
      });

      userService.getUser.mockResolvedValue(mockedUser);
      mockEntityManager.findOne.mockReturnValue(Promise.resolve(null));
      mockEntityManager.create.mockReturnValue(mockedStock);
      mockEntityManager.save.mockReturnValue(Promise.resolve(mockedStock));

      mockedStockHistoryRepository.create.mockReturnValue(mockedStockHistory);
      mockedStockHistoryRepository.save.mockReturnValue(
        Promise.resolve(mockedStockHistory),
      );

      await stockService.getStock(stockCode, userId);

      expect(mockEntityManager.findOne).toHaveBeenCalledTimes(1);
      expect(mockEntityManager.findOne).toHaveBeenCalledWith(Stock, {
        where: {
          symbol: mockedStockDto.symbol,
        },
      });

      expect(mockEntityManager.create).toHaveBeenCalledTimes(1);
      expect(mockEntityManager.create).toHaveBeenCalledWith(Stock, {
        symbol: mockedStockDto.symbol,
        name: mockedStockDto.name,
      });
      expect(mockEntityManager.save).toHaveBeenCalledTimes(1);
      expect(mockedStockHistoryRepository.create).toHaveBeenCalledTimes(1);
      expect(mockedStockHistoryRepository.create).toHaveBeenCalledWith({
        close: mockedStockDto.close,
        high: mockedStockDto.high,
        low: mockedStockDto.low,
        open: mockedStockDto.open,
        date: new Date(mockedStockDto.date + ' ' + mockedStockDto.time),
        user: mockedUser,
        stock: mockedStock,
      });
      expect(mockedStockHistoryRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the user does not exist', async () => {
      const userId = chance.guid();
      const stockCode = chance.string();

      userService.getUser.mockRejectedValue(new UnauthorizedException());

      await expect(stockService.getStock(stockCode, userId)).rejects.toThrow(
        'Unauthorized',
      );
    });
  });

  describe('Get stock history', () => {
    it('should return a stock history successfully', async () => {
      const userId = chance.guid();

      const mockedStock = buildMockedStock();
      const mockedStockHistory = buildMockedStockHistory({
        stock: mockedStock,
      });

      mockedStockHistoryRepository.find.mockReturnValue(
        Promise.resolve([mockedStockHistory]),
      );

      const result = await stockService.getStockHistory(userId);

      expect(mockedStockHistoryRepository.find).toHaveBeenCalledTimes(1);
      expect(mockedStockHistoryRepository.find).toHaveBeenCalledWith({
        where: {
          user: {
            id: userId,
          },
        },
        relations: ['stock'],
        order: {
          createdAt: 'DESC',
        },
      });

      expect(result).toMatchObject([
        {
          name: mockedStock.name,
          symbol: mockedStock.symbol,
          open: mockedStockHistory.open,
          high: mockedStockHistory.high,
          low: mockedStockHistory.low,
          close: mockedStockHistory.close,
        },
      ]);
    });
  });

  describe('Get stock stats', () => {
    it('should return a stock stats successfully', async () => {
      const mockedStock = buildMockedStock();
      const mockedStockHistory = buildMockedStockHistory({
        stock: mockedStock,
      });

      mockedStockHistoryRepository.createQueryBuilder = jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockReturnValue([mockedStockHistory]),
      }));

      const result = await stockService.getStockStats();

      expect(
        mockedStockHistoryRepository.createQueryBuilder,
      ).toHaveBeenCalledTimes(1);

      expect(result).toHaveLength(1);
    });
  });
});
