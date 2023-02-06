import { OutputExtendedLikesInfoDto } from '../../likes/dto/output-like.dto';
import { Post } from '../schemas/posts.schemas';

export class OutputPostDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: OutputExtendedLikesInfoDto;
  constructor(post: Post) {
    this.id = post.id;
    this.title = post.title;
    this.shortDescription = post.shortDescription;
    this.content = post.content;
    this.blogId = post.blogId;
    this.blogName = post.blogName;
    this.createdAt = post.createdAt;
    this.extendedLikesInfo = new OutputExtendedLikesInfoDto(post);
  }
}
export class OutputPostsWithPaginationDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: OutputPostDto[];
  constructor(
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: OutputPostDto[],
  ) {
    this.pagesCount = pagesCount;
    this.page = page;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.items = items;
  }
}
