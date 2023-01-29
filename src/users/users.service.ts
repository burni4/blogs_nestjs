import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserInputModelType } from './users.types';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(
    protected usersRepository: UsersRepository,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  async findUsers() {
    return await this.usersRepository.findUsers();
  }
  async addUsers(newUser: CreateUserInputModelType) {
    const user: UserDocument = new this.userModel();
    await this.usersRepository.save(user);
  }
}
