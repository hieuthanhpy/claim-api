import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username, pass) {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user.userId,
      username: user.username,
      role: user.role,
      idCardNumber: user.idCardNumber,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      role: user.role,
    };
  }
}
