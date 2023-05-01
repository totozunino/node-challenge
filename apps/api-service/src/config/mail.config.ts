import { registerAs } from '@nestjs/config';

const MAIL_CONFIG = 'MAIL_CONFIG';

export default registerAs(MAIL_CONFIG, () => {
  return {
    resetLinkUrl: process.env.RESET_LINK_URL,
  };
});
