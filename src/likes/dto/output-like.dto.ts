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
}
export class OutputNewestLikesDto {
  addedAt: string;
  userId: string;
  login: string;
}
