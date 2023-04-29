import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockHistory } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([StockHistory])],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
