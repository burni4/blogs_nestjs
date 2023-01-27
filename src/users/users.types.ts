export type CreateUserInputModelType = {
  login: string;
  password: string;
  email: string;
};

export type GetUsersInputQueriesModelType = {
  sortBy: string;
  sortDirection: string;
  pageNumber: string;
  pageSize: string;
  searchLoginTerm: string;
  searchEmailTerm: string;
};
