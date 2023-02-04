import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './schemas/users.schema';
import { CreateUserInputModelDto } from './dto/create-user.dto';
import { PaginationConverter } from '../helpers/pagination';
import {
  OutputUserDto,
  OutputUsersWithPaginationDto,
} from './dto/output-user.dto';

@Injectable()
export class UsersService {
  constructor(protected usersRepository: UsersRepository) {}
  async deleteAllUsers(): Promise<boolean> {
    return await this.usersRepository.deleteAllUsers();
  }
  async findUsers(
    paginationParams: PaginationConverter,
  ): Promise<OutputUsersWithPaginationDto> {
    const paginator: PaginationConverter = new PaginationConverter(
      paginationParams,
    );
    return await this.usersRepository.findUsers(paginator);
  }
  async addUsers(
    createUserDto: CreateUserInputModelDto,
  ): Promise<OutputUserDto | null> {
    const user: User = new User();
    await user.fillNewUserData(createUserDto);
    const result: User | null = await this.usersRepository.save(user);
    if (!result) return null;
    const outputUserDto = new OutputUserDto(user);
    return outputUserDto;
  }
  async deleteUserByID(userId: string): Promise<boolean> {
    const foundUser: User | null = await this.usersRepository.findUserByID(
      userId,
    );
    if (!foundUser) return false;

    const result: boolean = await this.usersRepository.delete(foundUser);

    return result;
  }
}
