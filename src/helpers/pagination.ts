import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationConverter {
  @IsOptional()
  sortBy: string | null = 'createdAt';
  @IsOptional()
  sortDirection: string | null = 'desc';
  @Transform(({ value }) => {
    return toInt(value, 1);
  })
  @IsNumber()
  @IsOptional()
  pageNumber: number | null = 1;
  @Transform(({ value }) => {
    return toInt(value, 10);
  })
  @IsNumber()
  @IsOptional()
  pageSize: number | null = 10;
  @IsOptional()
  searchNameTerm: string | null = null;
  @IsOptional()
  searchLoginTerm: string | null = null;
  @IsOptional()
  searchEmailTerm: string | null = null;

  constructor(obj: any) {
    console.log('constructor work', obj);
  }
  getSkipCount() {
    return (this.pageNumber - 1) * this.pageSize;
  }
  getPageCount(totalCount: number) {
    return Math.ceil(totalCount / this.pageSize);
  }
}

const toInt = (value: string, defaultValue = 0) => {
  const newValue = parseInt(value, 10);
  if (Number.isNaN(newValue)) {
    return defaultValue;
  }
  if (newValue <= 0) {
    return defaultValue;
  }
  return newValue;
};
