import { Module } from '@nestjs/common';
import { StockModule } from './stock/stock.module';
import { CSVParserModule } from './csv-parser/csv-parser.module';

@Module({
  imports: [StockModule, CSVParserModule],
})
export class AppModule {}
