import { Injectable } from '@nestjs/common';

type MailServiceSendMailArgs = {
  to: string;
  subject: string;
  template: string;
  context: { resetLink: string };
};

@Injectable()
export class MailService {
  public async sendMail(args: MailServiceSendMailArgs): Promise<void> {
    // Here we would send an email using a third party service
    return Promise.resolve();
  }
}
