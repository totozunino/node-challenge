import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock, StockHistory } from '../../entities';
import { Repository } from 'typeorm';
import axios, { AxiosError } from 'axios';
import {
  StockDto,
  StockResponseDto,
  StockStatsResponseDto,
} from '@node-challenge/dtos';
import stockServiceConfig from '../../config/stock-service.config';
import { ConfigType } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockHistory)
    private readonly stockHistoryRepository: Repository<StockHistory>,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @Inject(stockServiceConfig.KEY)
    private readonly stockServiceConfiguration: ConfigType<
      typeof stockServiceConfig
    >,
    private readonly userService: UserService,
  ) {}

  public async getStock(
    stockCode: string,
    userId: string,
  ): Promise<StockResponseDto> {
    const data = await this.getStockFromStockService(stockCode);

    const user = await this.userService.getUser({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const stock = await this.findOrCreateStock(data.symbol, data.name);

    const newStockHistory = this.stockHistoryRepository.create({
      close: data.close,
      high: data.high,
      low: data.low,
      open: data.open,
      date: new Date(data.date + ' ' + data.time),
      user,
      stock,
    });

    const stockHistory = await this.stockHistoryRepository.save(
      newStockHistory,
    );

    return {
      name: stockHistory.stock.name,
      symbol: stockHistory.stock.symbol,
      open: stockHistory.open,
      high: stockHistory.high,
      low: stockHistory.low,
      close: stockHistory.close,
    };
  }

  private async getStockFromStockService(stockCode: string): Promise<StockDto> {
    try {
      const { data } = await axios.get<StockDto>(
        this.stockServiceConfiguration.url,
        { params: { stockCode } },
      );

      return data;
    } catch (error) {
      if ((error as AxiosError).response.status === 404) {
        throw new NotFoundException('Stock not found');
      }
    }
  }

  public async getStockHistory(userId: string): Promise<StockResponseDto[]> {
    const stockHistory = await this.stockHistoryRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['stock'],
    });

    return stockHistory.map(({ createdAt, stock, open, high, low, close }) => ({
      createdAt,
      name: stock.name,
      symbol: stock.symbol,
      open,
      high,
      low,
      close,
    }));
  }

  public async getStockStats(): Promise<StockStatsResponseDto[]> {
    const stockStats = await this.stockHistoryRepository
      .createQueryBuilder('sh')
      .select('s.symbol', 'symbol')
      .addSelect('count(sh.stockId)', 'count')
      .innerJoin('sh.stock', 's')
      .groupBy('sh.stockId')
      .limit(5)
      .getRawMany();

    return stockStats.map(({ symbol, count }) => ({
      stock: symbol,
      timesRequested: count,
    }));
  }

  private async findOrCreateStock(
    symbol: string,
    name: string,
  ): Promise<Stock> {
    const stock = await this.stockRepository.findOne({ where: { symbol } });

    if (stock) {
      return stock;
    }

    const newStock = this.stockRepository.create({ symbol, name });

    return await this.stockRepository.save(newStock);
  }
}
