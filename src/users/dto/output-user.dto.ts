import { User } from '../schemas/users.schema';

export class OutputUserDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  constructor(user: User) {
    this.id = user.id;
    this.login = user.accountData.login;
    this.email = user.accountData.email;
    this.createdAt = user.accountData.createdAt;
  }
}
