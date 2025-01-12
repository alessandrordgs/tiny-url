import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginUserDTo } from '../users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly JwtService: JwtService,
    private readonly UsersService: UsersService,
  ) {}

  async login(LoginUserDTo: LoginUserDTo) {
    const user = await this.UsersService.findUserByLogin(LoginUserDTo);
    console.log(user);
    const token = this._createToken(user);
    return { user, ...token };
  }

  private _createToken(login: any) {
    const user = { login };
    const Authorization = this.JwtService.sign(user);
    return {
      expiresIn: process.env.EXPIRES_IN,
      Authorization,
    };
  }

  async validateUser(payload: any) {
    const user = await this.UsersService.findUserByPayload(payload);
    if (!user) {
      throw new ForbiddenException('Unauthorized');
    }
    return user;
  }

  async getUserFromAuthenticationToken(token: string) {
    const payload = this.JwtService.verify(token);
    return await this.UsersService.findUserByPayload(payload);
  }
}
