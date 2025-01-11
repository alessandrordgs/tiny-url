// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDTo } from './dto/password-user.dto';
import { hash } from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw an error if user already exists', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue({
        id: '1',
        email: 'existing@example.com',
      });

      const createUserDto: CreateUserDto = {
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password',
      };

      await expect(service.create(createUserDto)).rejects.toThrow(
        'User already exists',
      );
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should create a new user', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);
      (repository.save as jest.Mock).mockImplementation(async (user) => ({
        ...user,
        id: '1',
      }));

      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password',
      };

      const result = await service.create(createUserDto);

      expect(result).toHaveProperty('id', '1');
      expect(result).toHaveProperty('name', createUserDto.name);
      expect(result).toHaveProperty('email', createUserDto.email);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      (repository.save as jest.Mock).mockImplementation(async (user) => user);

      const updateUserDto: UpdateUserDto = {
        // `UpdateUserDto` now requires a `name`
        name: 'Updated Name',
        // `email` is optional, but we’ll include it here
        email: 'updated@example.com',
        // Note: Since `UpdateUserDto` extends `CreateUserDto`,
        // we could include a `password` field if desired, but
        // typically password updates happen via `updatePassword`.
      };

      const result = await service.update('1', updateUserDto);

      expect(result).toHaveProperty('id', '1');
      expect(result).toHaveProperty('name', updateUserDto.name);
      expect(result).toHaveProperty('email', updateUserDto.email);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('updatePassword', () => {
    it('should throw an error if user not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      const updatePasswordDto: UpdatePasswordDTo = {
        password: 'oldPass',
        newPassword: 'newPass',
      };

      await expect(
        service.updatePassword('1', updatePasswordDto),
      ).rejects.toThrow('User not found');
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if old password is incorrect', async () => {
      const hashedOldPass = await hash('oldPass', 10);
      (repository.findOne as jest.Mock).mockResolvedValue({
        id: '1',
        password: hashedOldPass,
      });

      const updatePasswordDto: UpdatePasswordDTo = {
        password: 'wrongPass',
        newPassword: 'newPass',
      };

      await expect(
        service.updatePassword('1', updatePasswordDto),
      ).rejects.toThrow('Password is incorrect');
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should update the password successfully', async () => {
      const hashedOldPass = await hash('oldPass', 10);
      (repository.findOne as jest.Mock).mockResolvedValue({
        id: '1',
        password: hashedOldPass,
      });
      (repository.save as jest.Mock).mockImplementation(async (user) => user);

      const updatePasswordDto: UpdatePasswordDTo = {
        password: 'oldPass',
        newPassword: 'newPass',
      };

      const result = await service.updatePassword('1', updatePasswordDto);

      expect(result.id).toBe('1');
      expect(repository.save).toHaveBeenCalledTimes(1);
      // Optionally verify that `result.password` is now hashed
    });
  });
});
