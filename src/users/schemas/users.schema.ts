import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';
import { CreateUserInputModelDto } from '../dto/create-user.dto';
import { OutputUsersWithPaginationDto } from '../dto/output-user.dto';

@Schema({ id: false, _id: false })
export class UserEmailConfirmation {
  constructor() {
    this.confirmationCode = randomUUID();
    // TODO: add time to expirationDate
    this.expirationDate = new Date();
    this.isConfirmed = false;
  }
  @Prop({ required: true })
  confirmationCode: string;
  @Prop({ required: true })
  expirationDate: Date;
  @Prop({ required: true })
  isConfirmed: boolean;
}
export const UserEmailConfirmationSchema = SchemaFactory.createForClass(
  UserEmailConfirmation,
);
@Schema({ id: false, _id: false })
export class UserAccountData {
  constructor(inputData: CreateUserInputModelDto) {
    this.login = inputData.login;
    this.email = inputData.email;
    this.passwordSalt = inputData.password;
    this.passwordHash = inputData.password;
    this.createdAt = new Date().toISOString();
  }
  @Prop({ required: true })
  login: string;
  @Prop({ required: true })
  passwordHash: string;
  @Prop({ required: true })
  passwordSalt: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  createdAt: string;
}

export const UserAccountDataSchema =
  SchemaFactory.createForClass(UserAccountData);
@Schema({ versionKey: false })
export class User {
  @Prop()
  id: string;

  @Prop({ type: UserAccountDataSchema })
  accountData: UserAccountData;

  @Prop({ type: UserEmailConfirmationSchema })
  emailConfirmation: UserEmailConfirmation;

  async confirmEmailByCode(code: string): Promise<boolean> {
    if (this.emailConfirmation.isConfirmed) return false;
    if (this.emailConfirmation.confirmationCode !== code) return false;
    if (this.emailConfirmation.expirationDate <= new Date()) return false;
    this.emailConfirmation.isConfirmed = true;
    return true;
  }
  async fillNewUserData(inputData: CreateUserInputModelDto): Promise<void> {
    this.id = randomUUID();
    this.emailConfirmation = new UserEmailConfirmation();
    this.accountData = new UserAccountData(inputData);
  }
  static userDocumentToUserClass(userDocument: UserDocument): User {
    const newUser = new User();
    newUser.id = userDocument.id;
    newUser.accountData = userDocument.accountData;
    newUser.emailConfirmation = userDocument.emailConfirmation;
    return newUser;
  }

  static mapUserDocumentsToOutputUsersWithPaginationDto(
    pagesCount,
    page,
    pageSize,
    totalCount,
    userDocuments: UserDocument[],
  ): OutputUsersWithPaginationDto {
    const users: User[] = [];

    userDocuments.forEach((document) => {
      users.push(this.userDocumentToUserClass(document));
    });

    const currentDTO: OutputUsersWithPaginationDto =
      new OutputUsersWithPaginationDto(
        pagesCount,
        page,
        pageSize,
        totalCount,
        users,
      );

    return currentDTO;
  }

  static async generateSalt(): Promise<string> {
    return '';
  }
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods = {
  confirmEmailByCode: User.prototype.confirmEmailByCode,
};
UserSchema.statics = {
  generateSalt: User.generateSalt,
};
