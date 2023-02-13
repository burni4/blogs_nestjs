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

export class OutputUserInformationDto {
  userid: string;
  login: string;
  email: string;
  constructor(user: User) {
    this.userid = user.id;
    this.login = user.accountData.login;
    this.email = user.accountData.email;
  }
}

export class OutputUsersWithPaginationDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: OutputUserDto[];
  constructor(
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: OutputUserDto[],
  ) {
    this.pagesCount = pagesCount;
    this.page = page;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.items = items;
  }
}
