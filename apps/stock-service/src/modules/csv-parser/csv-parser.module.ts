import { Module } from '@nestjs/common';
import { CSVParserService } from './csv-parser.service';

@Module({
  providers: [CSVParserService],
  exports: [CSVParserService],
})
export class CSVParserModule {}
