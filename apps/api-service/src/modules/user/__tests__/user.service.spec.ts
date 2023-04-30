import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { CreateUserInputDto, UserRole } from '@node-challenge/dtos';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../entities';
import { buildMockedUser, mockRepository } from '../../../../test/utils';
import Chance from 'chance';

const chance = new Chance();

describe('User Service', () => {
  let userService: UserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    userService = app.get<UserService>(UserService);
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const body: CreateUserInputDto = {
        email: chance.email(),
        role: chance.pickone(Object.values(UserRole)),
      };

      const mockedUser = buildMockedUser(body);

      mockRepository.findOne.mockReturnValue(null);
      mockRepository.create.mockReturnValue(mockedUser);
      mockRepository.save.mockReturnValue(Promise.resolve(mockedUser));

      await userService.register(body);

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledWith({
        email: body.email,
        role: body.role,
        password: expect.any(String),
      });
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledWith(mockedUser);
    });

    it('should throw an error if the user already exists', async () => {
      const body: CreateUserInputDto = {
        email: chance.email(),
        role: chance.pickone(Object.values(UserRole)),
      };

      const mockedUser = buildMockedUser(body);

      mockRepository.findOne.mockReturnValue(mockedUser);

      await expect(userService.register(body)).rejects.toThrow(
        'User already exists',
      );
    });
  });
});
