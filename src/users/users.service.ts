import { Injectable } from '@nestjs/common';
import { Role } from './users.enum';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'claimemployee',
      password: 'password',
      role: Role.EMPLOYEE,
    },
    {
      userId: 2,
      username: 'claimmanager',
      password: 'password',
      role: Role.MANAGER,
    },
    {
      userId: 3,
      username: 'claimcustomer',
      password: 'guess',
      role: Role.CUSTOMER,
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
