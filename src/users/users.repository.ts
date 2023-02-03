import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { Model } from 'mongoose';
import { PaginationConverter } from '../helpers/pagination';
import { OutputUsersWithPaginationDto } from './dto/output-user.dto';

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
      const newUser = new this.UserModel({ ...user });
      await newUser.deleteOne();
      return true;
    } catch (error) {
      return false;
    }
  }
  async deleteAllUsers(): Promise<boolean> {
    await this.UserModel.deleteMany({});
    return true;
  }
  async findUsers(
    paginator: PaginationConverter,
  ): Promise<OutputUsersWithPaginationDto> {
    let filter = {};
    const expressions = [];
    if (paginator.searchLoginTerm) {
      expressions.push({
        'accountData.login': {
          $regex: paginator.searchLoginTerm,
          $options: 'i',
        },
      });
    }
    if (paginator.searchEmailTerm) {
      expressions.push({
        'accountData.email': {
          $regex: paginator.searchEmailTerm,
          $options: 'i',
        },
      });
    }

    if (expressions.length > 0) {
      filter = { $or: expressions };
    }

    const foundUsersInDB = await this.UserModel.find(filter, {
      projection: { _id: 0 },
    })
      .sort({ [paginator.sortBy]: paginator.sortDirection === 'asc' ? 1 : -1 })
      .skip((paginator.pageNumber - 1) * paginator.pageSize)
      .limit(paginator.pageSize)
      .exec();

    const totalCount = await this.UserModel.count(filter);
    const pageCount: number = Math.ceil(totalCount / paginator.pageSize);

    return User.mapUserDocumentsToOutputUsersWithPaginationDto(
      pageCount,
      paginator.pageNumber,
      paginator.pageSize,
      totalCount,
      foundUsersInDB,
    );
  }
  async findUserByID(userId: string): Promise<User | null> {
    const userFromDB: UserDocument = await this.UserModel.findOne({
      id: userId,
    }).exec();
    if (!userFromDB) return null;
    const user: User = User.userDocumentToUserClass(userFromDB);
    return user;
  }
}
