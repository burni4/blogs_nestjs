import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { Model } from 'mongoose';
import { PaginationConverter } from '../helpers/pagination';
import { OutputUsersWithPaginationDto } from './dto/output-user.dto';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}
  async findUsers(
    paginator: PaginationConverter,
  ): Promise<OutputUsersWithPaginationDto> {
    const filter = {
      $or: [
        {
          'accountData.login': {
            $regex: paginator.searchLoginTerm ?? '',
            $options: 'i',
          },
        },
        {
          'accountData.email': {
            $regex: paginator.searchEmailTerm ?? '',
            $options: 'i',
          },
        },
      ],
    };

    const foundUsersInDB = await this.UserModel.find(filter, {
      projection: { _id: 0 },
    })
      .sort({
        [`accountData.${paginator.sortBy}`]:
          paginator.sortDirection === 'asc' ? 1 : -1,
      })
      .skip(paginator.getSkipCount())
      .limit(paginator.pageSize)
      .exec();

    const totalCount = await this.UserModel.count(filter);

    return User.mapUserDocumentsToOutputUsersWithPaginationDto(
      paginator.getPageCount(totalCount),
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
  async findUserByEmail(userEmail: string): Promise<User | null> {
    const userFromDB: UserDocument = await this.UserModel.findOne({
      'accountData.email': { $regex: userEmail, $options: 'i' },
    }).exec();
    if (!userFromDB) return null;
    const user: User = User.userDocumentToUserClass(userFromDB);
    return user;
  }

  async findUserByRecoveryCode(recoveryCode: string): Promise<User | null> {
    const userFromDB: UserDocument = await this.UserModel.findOne({
      'recoveryCodes.recoveryCode': recoveryCode,
    }).exec();
    if (!userFromDB) return null;
    const user: User = User.userDocumentToUserClass(userFromDB);
    return user;
  }

  async findUserByConfirmationCode(code: string): Promise<User | null> {
    const userFromDB: UserDocument = await this.UserModel.findOne({
      'emailConfirmation.confirmationCode': code,
    }).exec();
    if (!userFromDB) return null;
    const user: User = User.userDocumentToUserClass(userFromDB);
    return user;
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
    const userFromDB: UserDocument = await this.UserModel.findOne({
      $or: [
        { 'accountData.login': { $regex: loginOrEmail, $options: 'i' } },
        { 'accountData.email': { $regex: loginOrEmail, $options: 'i' } },
      ],
    }).exec();
    if (!userFromDB) return null;
    const user: User = User.userDocumentToUserClass(userFromDB);
    return user;
  }
}
