import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import Chance from 'chance';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../entities';
import { LoginInputDto, RefreshTokenInputDto } from '@node-challenge/dtos';
import { compare } from 'bcrypt';
import { buildMockedUser, mockRepository } from '../../../../test/utils';

const chance = new Chance();

jest.mock('@nestjs/jwt');

describe('Auth Service', () => {
  let authService: AuthService;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        AuthService,
        UserService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    authService = app.get<AuthService>(AuthService);
    jwtService = app.get(JwtService);
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

      mockRepository.findOneOrFail.mockReturnValue(Promise.resolve(mockedUser));

      (compare as jest.Mock) = jest.fn().mockReturnValue(true);

      jwtService.sign.mockReturnValue(token);

      const result = await authService.login(input);

      expect(mockRepository.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { email: input.email },
      });
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledWith(
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

      mockRepository.findOneOrFail.mockRejectedValue(
        new Error('User not found'),
      );

      await expect(authService.login(input)).rejects.toThrowError(
        'User not found',
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

      mockRepository.findOneOrFail.mockReturnValue(Promise.resolve(mockedUser));

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

      mockRepository.findOneOrFail.mockReturnValue(Promise.resolve(mockedUser));

      jwtService.sign.mockReturnValue(token);

      (compare as jest.Mock) = jest.fn().mockReturnValue(true);

      const result = await authService.refreshToken(userId, input);

      expect(mockRepository.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledWith(
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
      const userId = chance.guid();

      mockRepository.findOneOrFail.mockRejectedValue(
        new Error('User not found'),
      );

      await expect(
        authService.refreshToken(userId, input),
      ).rejects.toThrowError('User not found');
    });

    it('should throw an error if the refresh token is incorrect', async () => {
      const input: RefreshTokenInputDto = {
        refreshToken: chance.string(),
      };
      const userId = chance.guid();

      const mockedUser = buildMockedUser({
        id: userId,
      });

      mockRepository.findOneOrFail.mockReturnValue(Promise.resolve(mockedUser));

      (compare as jest.Mock) = jest.fn().mockReturnValue(false);

      await expect(
        authService.refreshToken(userId, input),
      ).rejects.toThrowError('Access denied');
    });
  });

  describe('logout', () => {
    it('should logout the user successfully', async () => {
      const userId = chance.guid();

      const mockedUser = buildMockedUser({
        id: userId,
      });

      mockRepository.update.mockReturnValue(Promise.resolve(mockedUser));

      await authService.logout(userId);

      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledWith(
        { id: userId },
        { refreshToken: null },
      );
    });
  });
});
