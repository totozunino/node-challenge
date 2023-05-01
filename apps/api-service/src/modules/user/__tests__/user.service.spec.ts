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
  const mockedUserRepository = mockRepository();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockedUserRepository,
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

      mockedUserRepository.findOne.mockReturnValue(null);
      mockedUserRepository.create.mockReturnValue(mockedUser);
      mockedUserRepository.save.mockReturnValue(Promise.resolve(mockedUser));

      await userService.register(body);

      expect(mockedUserRepository.create).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.create).toHaveBeenCalledWith({
        email: body.email,
        role: body.role,
        password: expect.any(String),
      });
      expect(mockedUserRepository.save).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.save).toHaveBeenCalledWith(mockedUser);
    });

    it('should throw an error if the user already exists', async () => {
      const body: CreateUserInputDto = {
        email: chance.email(),
        role: chance.pickone(Object.values(UserRole)),
      };

      const mockedUser = buildMockedUser(body);

      mockedUserRepository.findOne.mockReturnValue(mockedUser);

      await expect(userService.register(body)).rejects.toThrow(
        'User already exists',
      );
    });
  });
});
