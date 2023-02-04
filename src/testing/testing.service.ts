import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { BlogsRepository } from '../blogs/blogs.repository';
import { PostsRepository } from '../posts/posts.repository';
import { CommentsRepository } from '../comments/comments.repository';

@Injectable()
export class TestingService {
  constructor(
    protected usersRepository: UsersRepository,
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
    protected commentsRepository: CommentsRepository,
  ) {}
  async deleteAllData(): Promise<boolean> {
    const usersDeleted: boolean = await this.usersRepository.deleteAllUsers();
    const blogsDeleted: boolean = await this.blogsRepository.deleteAllBlogs();
    const postsDeleted: boolean = await this.postsRepository.deleteAllPosts();
    const commentsDeleted: boolean =
      await this.commentsRepository.deleteAllComments();
    return usersDeleted && blogsDeleted && postsDeleted && commentsDeleted;
  }
}
