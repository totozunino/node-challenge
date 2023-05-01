import { registerAs } from '@nestjs/config';

const AUTH_CONFIG = 'AUTH_CONFIG';

export default registerAs(AUTH_CONFIG, () => {
  return {
    secret: process.env.JWT_SECRET,
  };
});
