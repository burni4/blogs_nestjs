import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { CreateUserInputModelDto } from '../dto/create-user.dto';
import {
  OutputUserDto,
  OutputUsersWithPaginationDto,
} from '../dto/output-user.dto';

@Schema({ id: false, _id: false })
export class UserEmailConfirmation {
  constructor() {
    this.confirmationCode = randomUUID();
    this.expirationDate = new Date();
    this.isConfirmed = false;
    this.setExpirationDate(1);
  }
  @Prop({ required: true })
  confirmationCode: string;
  @Prop({ required: true })
  expirationDate: Date;
  @Prop({ required: true })
  isConfirmed: boolean;

  setExpirationDate(hours: number) {
    this.expirationDate = new Date(
      this.expirationDate.getTime() + hours * 60 * 60 * 1000,
    );
  }
}

export const UserEmailConfirmationSchema = SchemaFactory.createForClass(
  UserEmailConfirmation,
);

@Schema({ id: false, _id: false })
export class UserRecoveryCode {
  constructor() {
    this.recoveryCode = randomUUID();
    this.expirationDate = new Date();
    this.setExpirationDate(1);
  }
  @Prop({ required: true })
  recoveryCode: string;
  @Prop({ required: true })
  expirationDate: Date;

  setExpirationDate(hours: number) {
    this.expirationDate = new Date(
      this.expirationDate.getTime() + hours * 60 * 60 * 1000,
    );
  }
}
export const UserRecoveryCodeSchema =
  SchemaFactory.createForClass(UserRecoveryCode);
@Schema({ id: false, _id: false })
export class UserAccountData {
  constructor(inputData: CreateUserInputModelDto) {
    this.login = inputData.login;
    this.email = inputData.email;
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

  async generateSalt() {
    return await bcrypt.genSalt(10);
  }
  async generateHash(password: string) {
    return bcrypt.hash(password, this.passwordSalt);
  }
  async fillPasswordSaltAndHash(password: string) {
    this.passwordSalt = await this.generateSalt();
    this.passwordHash = await this.generateHash(password);
  }
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

  @Prop({ type: [UserRecoveryCodeSchema] })
  recoveryCodes: UserRecoveryCode[];

  confirmEmailByCode(code: string): boolean {
    if (this.emailConfirmation.isConfirmed) return false;
    if (this.emailConfirmation.confirmationCode !== code) return false;
    if (this.emailConfirmation.expirationDate <= new Date()) return false;
    this.emailConfirmation.isConfirmed = true;
    return true;
  }
  async checkCredentialsPasswordHash(password: string): Promise<boolean> {
    return (
      this.accountData.passwordHash ===
      (await this.accountData.generateHash(password))
    );
  }

  addRecoveryCode(): UserRecoveryCode {
    const recoveryCode: UserRecoveryCode = new UserRecoveryCode();
    this.recoveryCodes.push(recoveryCode);
    return recoveryCode;
  }
  deleteAllRecoveryCodes(): boolean {
    this.recoveryCodes.length = 0;
    return true;
  }
  async fillNewUserData(inputData: CreateUserInputModelDto): Promise<void> {
    this.id = randomUUID();
    this.accountData = new UserAccountData(inputData);
    this.emailConfirmation = new UserEmailConfirmation();
    this.recoveryCodes = [];
  }

  recoveryCodeIsValid(recoveryCode: string): boolean {
    const recoveryCodeObj: UserRecoveryCode = this.recoveryCodes.find(
      (elem) => elem.recoveryCode === recoveryCode,
    );
    if (!recoveryCodeObj) return false;
    if (recoveryCodeObj.expirationDate < new Date()) return false;
    return true;
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
    const users: OutputUserDto[] = [];

    userDocuments.forEach((document) => {
      const curUser: User = this.userDocumentToUserClass(document);
      const outputUserDto: OutputUserDto = new OutputUserDto(curUser);
      users.push(outputUserDto);
    });

    const currentDto: OutputUsersWithPaginationDto =
      new OutputUsersWithPaginationDto(
        pagesCount,
        page,
        pageSize,
        totalCount,
        users,
      );

    return currentDto;
  }
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods = {
  confirmEmailByCode: User.prototype.confirmEmailByCode,
};
