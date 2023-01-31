import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { Model } from 'mongoose';
import { PaginationConverter } from '../helpers/pagination';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}
  async save(user: User): Promise<User | null> {
    try {
      const newUser = new this.UserModel({ ...user });
      await newUser.save();
      return user;
    } catch (error) {
      return null;
    }
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
    paginationParams: PaginationConverter,
  ): Promise<UserDocument[]> {
    return await this.UserModel.find({}).exec();
  }
  async findUserByID(userId: string): Promise<UserDocument> {
    return await this.UserModel.findOne({ id: userId }).exec();
  }
}
