import { EmailAdapter } from '../adapters/email-adapter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailManager {
  constructor(protected emailAdapter: EmailAdapter) {}
  async sendEmailConfirmationMessage(confirmationCode: string, email: string) {
    const message = `<h1>Thank for your registration</h1> 
                    <p>To finish registration please follow the link below:
                        <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
                    </p>`;
    const subject = 'Thank for your registration on Incubator Homework';

    return await this.emailAdapter.sendEmailFromGmail(email, subject, message);
  }
  async sendEmailRecoveryPasswordMessage(recoveryCode: string, email: string) {
    const message = `<h1>Password recovery</h1>
                    <p>To finish password recovery please follow the link below:
                         <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
                     </p>`;
    const subject = 'Thank for your registration on Incubator Homework';

    return await this.emailAdapter.sendEmailFromGmail(email, subject, message);
  }
}
