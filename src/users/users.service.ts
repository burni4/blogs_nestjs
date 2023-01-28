import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(protected usersRepository: UsersRepository) {}
  async findUsers() {
    return await this.usersRepository.findUsers();
  }
}
