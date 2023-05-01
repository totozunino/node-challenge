import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock, StockHistory } from '../../entities';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([StockHistory, Stock])],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
