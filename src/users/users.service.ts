import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User, UserDocument } from './schemas/users.schema';
import { CreateUserInputModelDto } from './dto/create-user.dto';
import { PaginationConverter } from '../helpers/pagination';
import { OutputUserDto } from './dto/output-user.dto';

@Injectable()
export class UsersService {
  constructor(protected usersRepository: UsersRepository) {}
  async deleteAllUsers(): Promise<boolean> {
    return await this.usersRepository.deleteAllUsers();
  }
  async findUsers(paginationParams: PaginationConverter) {
    return await this.usersRepository.findUsers(paginationParams);
  }
  async addUsers(
    createUserDto: CreateUserInputModelDto,
  ): Promise<OutputUserDto | null> {
    const user: User = new User(createUserDto);
    const result = await this.usersRepository.save(user);
    if (!result) return null;
    const outputUserDto = new OutputUserDto(user);
    return outputUserDto;
  }
  async deleteUserByID(userId: string): Promise<boolean> {
    const foundUser: UserDocument = await this.usersRepository.findUserByID(
      userId,
    );
    if (!foundUser) return false;

    await this.usersRepository.delete(foundUser);

    return true;
  }
}
