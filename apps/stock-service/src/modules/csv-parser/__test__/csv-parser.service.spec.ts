import { Test, TestingModule } from '@nestjs/testing';
import { CSVParserService } from '../csv-parser.service';
import axios from 'axios';
import { Readable } from 'stream';
import { NotFoundException } from '@nestjs/common';

jest.mock('axios');

describe('CSVParserService', () => {
  let csvParserService: CSVParserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [CSVParserService],
    }).compile();

    csvParserService = app.get<CSVParserService>(CSVParserService);
  });

  describe('getStock', () => {
    it('should return a stock transformer stream', async () => {
      const mockedResponse = `Symbol,Date,Time,Open,High,Low,Close,Volume,Name
A.US,2023-04-27,20:54:34,132.96,133.86,131.33,133.16,335730,AGILENT TECHNOLOGIES`;

      const mockedStream = Readable.from(mockedResponse);

      const mockedStock = {
        symbol: 'A.US',
        date: '2023-04-27',
        time: '20:54:34',
        open: 132.96,
        high: 133.86,
        low: 131.33,
        close: 133.16,
        volume: 335730,
        name: 'AGILENT TECHNOLOGIES',
      };

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockedStream });

      const stockTransformer = await csvParserService.getStock('a.us');

      for await (const chunk of stockTransformer) {
        expect(JSON.parse(chunk)).toStrictEqual(mockedStock);
      }

      expect(stockTransformer).toBeDefined();
    });

    it('should throw error if stock does not exists', (done) => {
      const mockedResponse = `Symbol,Date,Time,Open,High,Low,Close,Volume,Name
test,N/D,N/D,N/D,N/D,N/D,N/D,N/D,test`;

      const mockedStream = Readable.from(mockedResponse);

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockedStream });

      csvParserService.getStock('a.us').then((response) => {
        response.on('error', (err) => {
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        });
      });

      expect.assertions(1);
    });

    it('should throw error if axios throws error', async () => {
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Axios error'));

      expect(csvParserService.getStock('a.us')).rejects.toThrow('Axios error');
    });

    it('should throw error if not valid csv', (done) => {
      const mockedResponse = `Symbol,Date,Time,Open,High,Low,Close,Volume
A.US,2023-04-27,20:54:34,132.96,133.86,131.33,133.16,335730`;

      const mockedStream = Readable.from(mockedResponse);

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockedStream });

      csvParserService.getStock('a.us').then((response) => {
        response.on('error', (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toBe('Invalid CSV format');
          done();
        });
      });

      expect.assertions(2);
    });
  });
});
