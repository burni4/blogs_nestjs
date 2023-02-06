import { Post } from '../../posts/schemas/posts.schemas';
import { empty } from 'rxjs';

export class OutputLikesInfoDto {
  likesCount: number;
  dislikesCount: number;
  myStatus: 'Like' | 'Dislike' | 'None';
}

export class OutputExtendedLikesInfoDto {
  likesCount: number;
  dislikesCount: number;
  myStatus: 'Like' | 'Dislike' | 'None';
  newestLikes: OutputNewestLikesDto[];
  constructor(data: Post | Comment) {
    this.likesCount = 0;
    this.dislikesCount = 0;
    this.myStatus = 'None';
    this.newestLikes = [new OutputNewestLikesDto(data)];
  }
}
export class OutputNewestLikesDto {
  addedAt: string;
  userId: string;
  login: string;
  constructor(data: Post | Comment) {
    this.addedAt = '';
    this.userId = '';
    this.login = '';
  }
}
