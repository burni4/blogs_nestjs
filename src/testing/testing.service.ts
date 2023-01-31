import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class TestingService {
  constructor(protected usersRepository: UsersRepository) {}
  async deleteAllData(): Promise<boolean> {
    const usersDeleted: boolean = await this.usersRepository.deleteAllUsers();
    return usersDeleted;
  }
}
