import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import Chance from 'chance';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../entities';
import {
  LoginInputDto,
  RefreshTokenInputDto,
  ResetPasswordInputDto,
} from '@node-challenge/dtos';
import { compare } from 'bcrypt';
import { buildMockedUser, mockRepository } from '../../../../test/utils';
import { MailService } from '../../../modules/mail/mail.service';
import mailConfig from '../../../config/mail.config';
import { UnauthorizedException } from '@nestjs/common';

const chance = new Chance();

jest.mock('@nestjs/jwt');
jest.mock('../../../modules/mail/mail.service');

describe('Auth Service', () => {
  let authService: AuthService;
  let jwtService: jest.Mocked<JwtService>;
  let mailService: jest.Mocked<MailService>;
  const mockedUserRepository = mockRepository();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        AuthService,
        UserService,
        JwtService,
        MailService,
        {
          provide: getRepositoryToken(User),
          useValue: mockedUserRepository,
        },
        {
          provide: mailConfig.KEY,
          useValue: {
            resetLinkUrl: chance.url(),
          },
        },
      ],
    }).compile();

    authService = app.get<AuthService>(AuthService);
    jwtService = app.get(JwtService);
    mailService = app.get(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login the user successfully', async () => {
      const input: LoginInputDto = {
        email: chance.email(),
        password: chance.string(),
      };

      const mockedUser = buildMockedUser({
        email: input.email,
      });

      const token = chance.string();

      mockedUserRepository.findOne.mockReturnValue(Promise.resolve(mockedUser));

      (compare as jest.Mock) = jest.fn().mockReturnValue(true);

      jwtService.sign.mockReturnValue(token);

      const result = await authService.login(input);

      expect(mockedUserRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: input.email },
      });
      expect(mockedUserRepository.update).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.update).toHaveBeenCalledWith(
        { id: mockedUser.id },
        { refreshToken: expect.any(String) },
      );
      expect(result).toMatchObject({
        accessToken: token,
        refreshToken: token,
      });
    });

    it('should throw an error if the user does not exist', async () => {
      const input: LoginInputDto = {
        email: chance.email(),
        password: chance.string(),
      };

      mockedUserRepository.findOne.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(authService.login(input)).rejects.toThrowError(
        'Invalid credentials',
      );
    });

    it('should throw an error if the password is incorrect', async () => {
      const input: LoginInputDto = {
        email: chance.email(),
        password: chance.string(),
      };

      const mockedUser = buildMockedUser({
        email: input.email,
      });

      mockedUserRepository.findOne.mockReturnValue(Promise.resolve(mockedUser));

      (compare as jest.Mock) = jest.fn().mockReturnValue(false);

      await expect(authService.login(input)).rejects.toThrowError(
        'Invalid credentials',
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh the token successfully', async () => {
      const input: RefreshTokenInputDto = {
        refreshToken: chance.string(),
      };
      const userId = chance.guid();

      const mockedUser = buildMockedUser({
        id: userId,
      });
      const token = chance.string();

      mockedUserRepository.findOne.mockReturnValue(Promise.resolve(mockedUser));

      jwtService.sign.mockReturnValue(token);
      jwtService.decode.mockReturnValue({ sub: userId });

      (compare as jest.Mock) = jest.fn().mockReturnValue(true);

      const result = await authService.refreshToken(input);

      expect(mockedUserRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockedUserRepository.update).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.update).toHaveBeenCalledWith(
        { id: mockedUser.id },
        { refreshToken: expect.any(String) },
      );
      expect(result).toMatchObject({
        accessToken: token,
        refreshToken: token,
      });
    });

    it('should throw an error if the user does not exist', async () => {
      const input: RefreshTokenInputDto = {
        refreshToken: chance.string(),
      };

      jwtService.decode.mockReturnValue({ sub: chance.guid() });
      mockedUserRepository.findOne.mockRejectedValue(
        new UnauthorizedException(),
      );

      await expect(authService.refreshToken(input)).rejects.toThrowError(
        'Unauthorized',
      );
    });

    it('should throw an error if the refresh token is incorrect', async () => {
      const input: RefreshTokenInputDto = {
        refreshToken: chance.string(),
      };
      const userId = chance.guid();

      const mockedUser = buildMockedUser({
        id: userId,
      });

      jwtService.decode.mockReturnValue({ sub: userId });
      mockedUserRepository.findOne.mockReturnValue(Promise.resolve(mockedUser));

      (compare as jest.Mock) = jest.fn().mockReturnValue(false);

      await expect(authService.refreshToken(input)).rejects.toThrowError(
        'Access denied',
      );
    });
  });

  describe('logout', () => {
    it('should logout the user successfully', async () => {
      const userId = chance.guid();

      const mockedUser = buildMockedUser({
        id: userId,
      });

      mockedUserRepository.update.mockReturnValue(Promise.resolve(mockedUser));

      await authService.logout(userId);

      expect(mockedUserRepository.update).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.update).toHaveBeenCalledWith(
        { id: userId },
        { refreshToken: null },
      );
    });
  });

  describe('sendPasswordRecoveryEmail', () => {
    it('should send the password recovery email successfully', async () => {
      const email = chance.email();

      const mockedUser = buildMockedUser({
        email,
      });

      mockedUserRepository.findOne.mockReturnValue(Promise.resolve(mockedUser));

      mockedUserRepository.update.mockReturnValue(Promise.resolve(mockedUser));

      await authService.sendPasswordRecoveryEmail(email);

      expect(mockedUserRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(mockedUserRepository.update).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.update).toHaveBeenCalledWith(
        { id: mockedUser.id },
        {
          resetPasswordToken: expect.any(String),
          resetPasswordExpires: expect.any(Date),
        },
      );

      expect(mailService.sendMail).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the user does not exist', async () => {
      mockedUserRepository.findOne.mockReturnValue(Promise.resolve(null));

      await expect(
        authService.sendPasswordRecoveryEmail(chance.email()),
      ).rejects.toThrowError('User not found');
    });
  });

  describe('resetPassword', () => {
    it('should reset the password successfully', async () => {
      const input: ResetPasswordInputDto = {
        password: chance.string(),
        token: chance.string(),
      };

      const mockedUser = buildMockedUser({
        resetPasswordToken: input.token,
        resetPasswordExpires: new Date(),
      });

      mockedUserRepository.findOne.mockReturnValue(Promise.resolve(mockedUser));

      mockedUserRepository.update.mockReturnValue(Promise.resolve(mockedUser));

      await authService.resetPassword(input.token, input.password);

      expect(mockedUserRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.findOne).toHaveBeenCalledWith({
        where: { resetPasswordToken: input.token },
      });
      expect(mockedUserRepository.update).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.update).toHaveBeenCalledWith(
        { id: mockedUser.id },
        {
          password: expect.any(String),
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      );
    });

    it('should throw an error if the token is invalid', async () => {
      const input: ResetPasswordInputDto = {
        password: chance.string(),
        token: chance.string(),
      };

      mockedUserRepository.findOne.mockReturnValue(Promise.resolve(null));

      await expect(
        authService.resetPassword(input.token, input.password),
      ).rejects.toThrowError('Unauthorized');
    });

    it('should throw an error if the token is expired', async () => {
      const input: ResetPasswordInputDto = {
        password: chance.string(),
        token: chance.string(),
      };

      const mockedUser = buildMockedUser({
        resetPasswordToken: input.token,
        resetPasswordExpires: new Date(
          new Date().getTime() - 60 * 60 * 1000 * 2,
        ),
      });

      mockedUserRepository.findOne.mockReturnValue(Promise.resolve(mockedUser));

      await expect(
        authService.resetPassword(input.token, input.password),
      ).rejects.toThrowError('Unauthorized');
    });
  });
});
