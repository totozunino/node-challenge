import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserInputDto, UserRole } from '@node-challenge/dtos';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities';
import Chance from 'chance';

const chance = new Chance();

const buildMockedMember = (attrs: Partial<User>): User => {
  return {
    createdAt: new Date(),
    email: chance.email(),
    id: chance.guid(),
    password: chance.hash(),
    role: chance.pickone(Object.values(UserRole)),
    updatedAt: new Date(),
    stockHistory: null,
    refreshToken: null,
    ...attrs,
  };
};

describe('User Service', () => {
  let userService: UserService;

  const usersRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository,
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

      const mockedMember = buildMockedMember(body);

      usersRepository.findOne.mockReturnValue(null);
      usersRepository.create.mockReturnValue(mockedMember);
      usersRepository.save.mockReturnValue(Promise.resolve(mockedMember));

      await userService.register(body);

      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledWith({
        email: body.email,
        role: body.role,
        password: expect.any(String),
      });
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(mockedMember);
    });

    it('should throw an error if the user already exists', async () => {
      const body: CreateUserInputDto = {
        email: chance.email(),
        role: chance.pickone(Object.values(UserRole)),
      };

      const mockedMember = buildMockedMember(body);

      usersRepository.findOne.mockReturnValue(mockedMember);

      await expect(userService.register(body)).rejects.toThrow(
        'User already exists',
      );
    });
  });
});
