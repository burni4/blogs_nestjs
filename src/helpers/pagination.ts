export class PaginationConverter {
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;

  constructor(obj) {
    if (typeof obj['sortBy'] !== 'undefined') {
      this.sortBy = obj.sortBy;
    } else {
      this.sortBy = 'createdAt';
    }
    if (typeof obj['sortDirection'] !== 'undefined') {
      this.sortDirection = obj.sortDirection;
    } else {
      this.sortDirection = 'desc';
    }
    if (typeof obj['pageNumber'] !== 'undefined') {
      this.pageNumber = obj.pageNumber;
    } else {
      this.pageNumber = 1;
    }
    if (typeof obj['pageSize'] !== 'undefined') {
      this.pageSize = obj.pageSize;
    } else {
      this.pageSize = 10;
    }
    if (typeof obj['searchLoginTerm'] !== 'undefined') {
      this.searchLoginTerm = obj.searchLoginTerm;
    } else {
      this.searchLoginTerm = null;
    }
    if (typeof obj['searchEmailTerm'] !== 'undefined') {
      this.searchEmailTerm = obj.searchEmailTerm;
    } else {
      this.searchEmailTerm = null;
    }
  }
}
