import { Injectable, Logger } from '@nestjs/common';
import type { ISendMailOptions } from '@nestjs-modules/mailer';
import { MailerService } from '@nestjs-modules/mailer';
import { BaseConfig, IBaseConfig } from '../../configs/base.config';
import { IMailConfig, MailConfig } from '../../configs/mail.config';

@Injectable()
export class MailSenderService {
  private logger = new Logger(MailSenderService.name);

  constructor(
    private readonly mailService: MailerService,
    @MailConfig() private readonly mailConfig: IMailConfig,
    @BaseConfig() private readonly baseConfig: IBaseConfig
  ) {}

  async sendMail(
    mailOptions: ISendMailOptions,
    extra?: { shouldThrow?: boolean }
  ): Promise<boolean> {
    const sender = this.mailService.sendMail(mailOptions).then(() => true);
    if (extra?.shouldThrow) {
      return sender;
    }

    return sender.catch((reason) => {
      if (reason) {
        console.error(reason);
        this.logger.error(`Mail sending failed: ${reason.message}`, reason.stack);
      }
      return false;
    });
  }

  commonEmailOptions(info: {
    to: string;
    title: string;
    message: string;
    buttonUrl: string;
    buttonText: string;
  }) {
    const { title, message } = info;

    return {
      notifyMessage: message,
      subject: `${title} - ${this.baseConfig.brandName}`,
      template: 'normal',
      context: {
        partialBody: 'common-body',
        ...info,
      },
    };
  }

  resetPasswordEmailOptions(info: { name: string; email: string; resetPasswordUrl: string }) {
    const { name, email, resetPasswordUrl } = info;
    return {
      subject: `Reset your password - ${this.baseConfig.brandName}`,
      template: 'normal',
      context: {
        name,
        email,
        resetPasswordUrl,
        partialBody: 'reset-password',
      },
    };
  }

  sendEmailVerifyCodeEmailOptions(info: { title: string; message: string }) {
    const { title } = info;
    return {
      subject: `${title} - ${this.baseConfig.brandName}`,
      template: 'normal',
      context: {
        partialBody: 'email-verify-code',
        ...info,
      },
    };
  }
}
