import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { UpdatePasswordDTo } from './dto/password-user.dto';
import { LoginUserDTo } from './dto/login-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const hasUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (hasUser) {
      throw new Error('User already exists');
    }

    return await this.userRepository.save({
      ...createUserDto,
      password: await hash(createUserDto.password, 10),
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.save({ ...updateUserDto, id: id });
  }

  async updatePassword(id: string, UpdatePasswordDTo: UpdatePasswordDTo) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      select: ['id', 'email', 'password'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isEqual = await compare(UpdatePasswordDTo.password, user.password);

    if (!isEqual) {
      throw new ForbiddenException('Password is incorrect');
    }

    return await this.userRepository.save({
      ...user,
      password: await hash(UpdatePasswordDTo.newPassword, 10),
    });
  }

  async findUserByLogin(LoginUserDTo: LoginUserDTo) {
    const user = await this.userRepository.findOne({
      where: {
        email: LoginUserDTo.email,
      },
      select: ['id', 'email', 'password'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isEqual = await compare(LoginUserDTo.password, user.password);

    if (!isEqual) {
      throw new ForbiddenException('Password is incorrect');
    }

    return user;
  }

  async findUserByPayload({ login }: any) {
    return await this.userRepository.findOne({
      where: login,
    });
  }
}
