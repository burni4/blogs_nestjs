import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  findUsers() {
    return true;
  }
}
