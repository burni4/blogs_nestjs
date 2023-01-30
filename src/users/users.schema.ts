import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { CreateUserInputModelType } from './users.types';

@Schema()
export class UserEmailConfirmation {
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
@Schema()
export class UserAccountData {
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

export const UserAccountDataSchema = SchemaFactory.createForClass(
  UserEmailConfirmation,
);
@Schema()
export class User {
  //@Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  @Prop()
  _id: Types.ObjectId;

  @Prop({ required: true, type: UserAccountDataSchema })
  accountData: UserAccountData;

  @Prop({ required: true, type: UserEmailConfirmationSchema })
  emailConfirmation: UserEmailConfirmation;

  async confirmEmailByCode(code: string): Promise<boolean> {
    if (this.emailConfirmation.isConfirmed) return false;
    if (this.emailConfirmation.confirmationCode !== code) return false;
    if (this.emailConfirmation.expirationDate <= new Date()) return false;
    this.emailConfirmation.isConfirmed = true;
    return true;
  }
  async fillEntity(data: CreateUserInputModelType): Promise<void> {
    this._id = new Types.ObjectId();
    this.accountData.login = data.login;
    this.accountData.email = data.email;
    this.accountData.createdAt = new Date().toISOString();
  }
  static async generateSalt(): Promise<string> {
    return '';
  }
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods = {
  confirmEmailByCode: User.prototype.confirmEmailByCode,
  fillEntity: User.prototype.fillEntity,
};
UserSchema.statics = {
  generateSalt: User.generateSalt,
};
