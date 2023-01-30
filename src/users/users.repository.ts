import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { GetUsersInputQueriesModelType } from './users.types';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}
  async save(user: UserDocument): Promise<boolean> {
    await user.save();
    return true;
  }
  async delete(user: UserDocument): Promise<boolean> {
    await user.deleteOne();
    return true;
  }
  async deleteAllUsers(): Promise<boolean> {
    await this.UserModel.deleteMany({});
    return true;
  }
  async findUsers(
    paginationParams: GetUsersInputQueriesModelType,
  ): Promise<UserDocument[]> {
    return await this.UserModel.find({}).exec();
  }
  async findUserByID(userId: string): Promise<UserDocument> {
    return await this.UserModel.findOne({ _id: userId }).exec();
  }
}
