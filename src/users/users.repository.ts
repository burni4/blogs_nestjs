import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { Model } from 'mongoose';

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
  async delete(user: User): Promise<boolean> {
    try {
      const result = await this.UserModel.deleteOne({
        id: user.id,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
  async deleteAllUsers(): Promise<boolean> {
    await this.UserModel.deleteMany({});
    return true;
  }
}
