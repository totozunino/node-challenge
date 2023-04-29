import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { CSVParserModule } from '../csv-parser/csv-parser.module';

@Module({
  imports: [CSVParserModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
