import { registerAs } from '@nestjs/config';

const STOCK_SERVICE_CONFIG = 'STOCK_SERVICE_CONFIG';

export default registerAs(STOCK_SERVICE_CONFIG, () => {
  return {
    url: process.env.STOCK_SERVICE_URL,
  };
});
