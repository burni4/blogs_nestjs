import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import {
  CreateUserInputModelType,
  GetUsersInputQueriesModelType,
} from './users.types';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(
    protected usersRepository: UsersRepository,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
  ) {}
  async deleteAllUsers(): Promise<boolean> {
    return await this.usersRepository.deleteAllUsers();
  }
  async findUsers(paginationParams: GetUsersInputQueriesModelType) {
    return await this.usersRepository.findUsers(paginationParams);
  }
  async addUsers(newUser: CreateUserInputModelType) {
    const user: UserDocument = new this.UserModel();

    await this.usersRepository.save(user);
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
