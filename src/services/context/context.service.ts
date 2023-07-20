import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Role } from 'src/users/users.enum';

@Injectable({ scope: Scope.REQUEST })
export class ContextService {
  private _role: Role;

  constructor(@Inject(REQUEST) public request: any) {}

  get role(): Role {
    return this.request.user['role'] || Role.EMPLOYEE;
  }
}
