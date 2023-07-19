import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'claimemployee',
      password: 'password',
      role: 'claimemployee',
    },
    {
      userId: 2,
      username: 'claimmanager',
      password: 'guess',
      role: 'claimmanager',
    },
    {
      userId: 3,
      username: 'claimcustomer',
      password: 'guess',
      role: 'claimcustomer',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
