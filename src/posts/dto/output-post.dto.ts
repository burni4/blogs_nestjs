import { OutputExtendedLikesInfoDto } from '../../likes/dto/output-like.dto';

export class OutputPostDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: OutputExtendedLikesInfoDto;
  constructor() {}
}
export class OutputPostsWithPaginationDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: OutputPostDto[];
  constructor() {}
}
