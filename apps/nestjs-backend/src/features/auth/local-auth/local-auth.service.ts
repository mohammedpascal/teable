/* eslint-disable sonarjs/no-duplicate-string */
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { generateUserId, getRandomString, HttpErrorCode, RandomType } from '@teable/core';
import { PrismaService } from '@teable/db-main-prisma';
import { MailTransporterType, MailType } from '@teable/openapi';
import type { IChangePasswordRo, IInviteWaitlistVo, ISignup } from '@teable/openapi';
import * as bcrypt from 'bcrypt';
import { isEmpty } from 'lodash';
import ms from 'ms';
import { ClsService } from 'nestjs-cls';
import { CacheService } from '../../../cache/cache.service';
import { AuthConfig, type IAuthConfig } from '../../../configs/auth.config';
import { BaseConfig, IBaseConfig } from '../../../configs/base.config';
import { MailConfig, type IMailConfig } from '../../../configs/mail.config';
import { CustomHttpException } from '../../../custom.exception';
import { EventEmitterService } from '../../../event-emitter/event-emitter.service';
import { Events } from '../../../event-emitter/events';
import { UserSignUpEvent } from '../../../event-emitter/events/user/user.event';
import type { IClsStore } from '../../../types/cls';
import { second } from '../../../utils/second';
import { MailSenderService } from '../../mail-sender/mail-sender.service';
import { SettingService } from '../../setting/setting.service';
import { UserService } from '../../user/user.service';
import { SessionStoreService } from '../session/session-store.service';

@Injectable()
export class LocalAuthService {
  private readonly logger = new Logger(LocalAuthService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly cls: ClsService<IClsStore>,
    private readonly sessionStoreService: SessionStoreService,
    private readonly mailSenderService: MailSenderService,
    private readonly cacheService: CacheService,
    private readonly eventEmitterService: EventEmitterService,
    @AuthConfig() private readonly authConfig: IAuthConfig,
    @MailConfig() private readonly mailConfig: IMailConfig,
    @BaseConfig() private readonly baseConfig: IBaseConfig,
    private readonly jwtService: JwtService,
    private readonly settingService: SettingService
  ) {}

  private async encodePassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return { salt, hashPassword };
  }

  private async comparePassword(
    password: string,
    hashPassword: string | null,
    salt: string | null
  ) {
    const _hashPassword = await bcrypt.hash(password || '', salt || '');
    return _hashPassword === hashPassword;
  }

  private async getUserByIdOrThrow(userId: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async validateUserByEmail(email: string, pass: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user || (user.accounts.length === 0 && user.password == null)) {
      throw new BadRequestException(`${email} not registered`);
    }

    if (!user.password) {
      throw new BadRequestException('Password is not set');
    }

    if (user.isSystem) {
      throw new BadRequestException('User is system user');
    }

    const { password, salt, ...result } = user;
    return (await this.comparePassword(pass, password, salt)) ? { ...result, password } : null;
  }

  private jwtSignupCode(email: string, code: string) {
    return this.jwtService.signAsync(
      { email, code },
      { expiresIn: this.authConfig.signupVerificationExpiresIn }
    );
  }

  private jwtVerifySignupCode(token: string) {
    return this.jwtService.verifyAsync<{ email: string; code: string }>(token).catch(() => {
      throw new CustomHttpException('Verification code is invalid', HttpErrorCode.INVALID_CAPTCHA);
    });
  }

  private async verifySignup(body: ISignup) {
    const setting = await this.settingService.getSetting();
    if (!setting?.enableEmailVerification) {
      return;
    }
    const { email, verification } = body;
    if (!verification) {
      const { token, expiresTime } = await this.sendSignupVerificationCode(email);
      throw new CustomHttpException(
        'Verification is required',
        HttpErrorCode.UNPROCESSABLE_ENTITY,
        {
          token,
          expiresTime,
        }
      );
    }
    const { code, email: _email } = await this.jwtVerifySignupCode(verification.token);
    if (_email !== email || code !== verification.code) {
      throw new CustomHttpException('Verification code is invalid', HttpErrorCode.INVALID_CAPTCHA);
    }
  }

  private isRegisteredValidate(user: Awaited<ReturnType<typeof this.userService.getUserByEmail>>) {
    if (user && (user.password !== null || user.accounts.length > 0)) {
      throw new HttpException(`User ${user.email} is already registered`, HttpStatus.CONFLICT);
    }
    if (user && user.isSystem) {
      throw new HttpException(`User ${user.email} is system user`, HttpStatus.BAD_REQUEST);
    }
  }

  async signup(body: ISignup) {
    const { email, password, defaultSpaceName, refMeta, inviteCode } = body;
    await this.verifySignup(body);

    const user = await this.userService.getUserByEmail(email);
    this.isRegisteredValidate(user);
    const { salt, hashPassword } = await this.encodePassword(password);
    const res = await this.prismaService.$tx(async (prisma) => {
      if (user) {
        return await prisma.user.update({
          where: { id: user.id, deletedTime: null },
          data: {
            salt,
            password: hashPassword,
            lastSignTime: new Date().toISOString(),
            refMeta: refMeta ? JSON.stringify(refMeta) : undefined,
          },
        });
      }
      return await this.userService.createUserWithSettingCheck(
        {
          id: generateUserId(),
          name: email.split('@')[0],
          email,
          salt,
          password: hashPassword,
          lastSignTime: new Date().toISOString(),
          refMeta: isEmpty(refMeta) ? undefined : JSON.stringify(refMeta),
        },
        undefined,
        defaultSpaceName,
        inviteCode
      );
    });
    this.eventEmitterService.emitAsync(Events.USER_SIGNUP, new UserSignUpEvent(res.id));
    return res;
  }

  async sendSignupVerificationCode(email: string) {
    const code = getRandomString(4, RandomType.Number);
    const token = await this.jwtSignupCode(email, code);
    if (this.baseConfig.enableEmailCodeConsole) {
      console.info('Signup Verification code: ', '\x1b[34m' + code + '\x1b[0m');
    }
    const user = await this.userService.getUserByEmail(email);
    this.isRegisteredValidate(user);
    const emailOptions = await this.mailSenderService.sendEmailVerifyCodeEmailOptions({
      title: 'Signup verification',
      message: `Your verification code is ${code}, expires in ${this.authConfig.signupVerificationExpiresIn}.`,
    });
    await this.mailSenderService.sendMail(
      {
        to: email,

        ...emailOptions,
      },
      {
        type: MailType.VerifyCode,
        transporterName: MailTransporterType.Notify,
      }
    );
    return {
      token,
      expiresTime: new Date(
        ms(this.authConfig.signupVerificationExpiresIn) + Date.now()
      ).toISOString(),
    };
  }

  async changePassword({ password, newPassword }: IChangePasswordRo) {
    const userId = this.cls.get('user.id');
    const user = await this.getUserByIdOrThrow(userId);

    const { password: currentHashPassword, salt } = user;
    if (!(await this.comparePassword(password, currentHashPassword, salt))) {
      throw new BadRequestException('Password is incorrect');
    }
    const { salt: newSalt, hashPassword: newHashPassword } = await this.encodePassword(newPassword);
    await this.prismaService.txClient().user.update({
      where: { id: userId, deletedTime: null },
      data: {
        password: newHashPassword,
        salt: newSalt,
      },
    });
    // clear session
    await this.sessionStoreService.clearByUserId(userId);
  }

  async sendResetPasswordEmail(email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user || (user.accounts.length === 0 && user.password == null)) {
      throw new BadRequestException(`${email} not registered`);
    }

    const resetPasswordCode = getRandomString(30);

    const url = `${this.mailConfig.origin}/auth/reset-password?code=${resetPasswordCode}`;
    const resetPasswordEmailOptions = await this.mailSenderService.resetPasswordEmailOptions({
      name: user.name,
      email: user.email,
      resetPasswordUrl: url,
    });
    await this.mailSenderService.sendMail(
      {
        to: user.email,
        ...resetPasswordEmailOptions,
      },
      {
        type: MailType.ResetPassword,
        transporterName: MailTransporterType.Notify,
      }
    );
    await this.cacheService.set(
      `reset-password-email:${resetPasswordCode}`,
      { userId: user.id },
      second(this.authConfig.resetPasswordEmailExpiresIn)
    );
  }

  async resetPassword(code: string, newPassword: string) {
    const resetPasswordEmail = await this.cacheService.get(`reset-password-email:${code}`);
    if (!resetPasswordEmail) {
      throw new BadRequestException('Token is invalid');
    }
    const { userId } = resetPasswordEmail;
    const { salt, hashPassword } = await this.encodePassword(newPassword);
    await this.prismaService.txClient().user.update({
      where: { id: userId, deletedTime: null },
      data: {
        password: hashPassword,
        salt,
      },
    });
    await this.cacheService.del(`reset-password-email:${code}`);
    // clear session
    await this.sessionStoreService.clearByUserId(userId);
  }

  async addPassword(newPassword: string) {
    const userId = this.cls.get('user.id');
    const user = await this.getUserByIdOrThrow(userId);

    if (user.password) {
      throw new BadRequestException('Password is already set');
    }
    const { salt, hashPassword } = await this.encodePassword(newPassword);
    await this.prismaService.txClient().user.update({
      where: { id: userId, deletedTime: null, password: null },
      data: {
        password: hashPassword,
        salt,
      },
    });
    // clear session
    await this.sessionStoreService.clearByUserId(userId);
  }

  async changeEmail(email: string, token: string, code: string) {
    const currentEmail = this.cls.get('user.email');
    const {
      code: _code,
      email: _currentEmail,
      newEmail,
    } = await this.jwtService
      .verifyAsync<{ email: string; code: string; newEmail: string }>(token)
      .catch(() => {
        throw new CustomHttpException(
          'Verification code is invalid',
          HttpErrorCode.INVALID_CAPTCHA
        );
      });
    if (newEmail !== email || _currentEmail !== currentEmail || _code !== code) {
      throw new CustomHttpException('Verification code is invalid', HttpErrorCode.INVALID_CAPTCHA);
    }
    const user = this.cls.get('user');
    await this.prismaService.txClient().user.update({
      where: { id: user.id, deletedTime: null, deactivatedTime: null },
      data: { email: newEmail },
    });
    // clear session
    await this.sessionStoreService.clearByUserId(user.id);
  }

  async sendChangeEmailCode(newEmail: string, password: string) {
    const email = this.cls.get('user.email');
    if (newEmail === email) {
      throw new CustomHttpException(
        'New email is the same as the current email',
        HttpErrorCode.CONFLICT
      );
    }
    const invalidPasswordError = new CustomHttpException(
      'Password is incorrect',
      HttpErrorCode.INVALID_CREDENTIALS
    );
    const user = await this.validateUserByEmail(email, password).catch(() => {
      throw invalidPasswordError;
    });
    if (!user) {
      throw invalidPasswordError;
    }
    const userByNewEmail = await this.userService.getUserByEmail(newEmail);
    if (userByNewEmail) {
      throw new ConflictException('New email is already registered');
    }
    const code = getRandomString(4, RandomType.Number);
    const token = await this.jwtService.signAsync(
      { email, newEmail, code },
      { expiresIn: this.baseConfig.emailCodeExpiresIn }
    );
    if (this.baseConfig.enableEmailCodeConsole) {
      console.info('Change Email Verification code: ', '\x1b[34m' + code + '\x1b[0m');
    }
    const emailOptions = await this.mailSenderService.sendEmailVerifyCodeEmailOptions({
      title: 'Change Email verification',
      message: `Your verification code is ${code}, expires in ${this.baseConfig.emailCodeExpiresIn}.`,
    });
    await this.mailSenderService.sendMail(
      {
        to: newEmail,
        ...emailOptions,
      },
      {
        type: MailType.VerifyCode,
        transporterName: MailTransporterType.Notify,
      }
    );
    return { token };
  }

  async joinWaitlist(email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (user) {
      throw new ConflictException('Email already registered');
    }
    const find = await this.prismaService.txClient().waitlist.findFirst({
      where: { email },
    });
    if (find) {
      return find;
    }
    return await this.prismaService.txClient().waitlist.create({
      data: { email },
    });
  }

  async getWaitlist() {
    return await this.prismaService.txClient().waitlist.findMany({
      orderBy: { createdTime: 'desc' },
    });
  }

  async inviteWaitlist(emails: string[]) {
    const list = await this.prismaService.txClient().waitlist.findMany({
      where: { email: { in: emails } },
    });

    const updateList = list.filter((item) => !item.invite);

    if (updateList.length === 0) {
      return [];
    }

    await this.prismaService.txClient().waitlist.updateMany({
      where: { email: { in: updateList.map((item) => item.email) } },
      data: { invite: true, inviteTime: new Date().toISOString() },
    });

    const res: IInviteWaitlistVo = [];
    for (const item of updateList) {
      const times = 10;
      const code = await this.genWaitlistInviteCode(times);
      const mailOptions = await this.mailSenderService.commonEmailOptions({
        to: item.email,
        title: 'Welcome',
        message: `You're off the waitlist!, Here is your invite code: ${code}, it can be used ${times} times`,
        buttonUrl: `${this.mailConfig.origin}/auth/signup?inviteCode=${code}`,
        buttonText: 'Signup',
      });
      res.push({
        email: item.email,
        code,
        times,
      });
      this.mailSenderService.sendMail(
        {
          to: item.email,
          ...mailOptions,
        },
        {
          transporterName: MailTransporterType.Notify,
          type: MailType.WaitlistInvite,
        }
      );
    }

    return res;
  }

  async genWaitlistInviteCode(limit: number) {
    const code = `${getRandomString(4)}-${getRandomString(4)}`;
    await this.cacheService.set(
      `waitlist:invite-code:${code}`,
      limit,
      1000 * 60 * 60 * 24 * 30 // 30 days
    );
    return code;
  }
}
