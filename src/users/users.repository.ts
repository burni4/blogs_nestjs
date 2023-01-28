import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}
  async save(user: UserDocument): Promise<boolean> {
    await user.save();
    return true;
  }
  async findUsers(): Promise<UserDocument[]> {
    return await this.UserModel.find().exec();
  }
}
