import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { BlogsRepository } from '../blogs/blogs.repository';
import { PostsRepository } from '../posts/posts.repository';
import { CommentsRepository } from '../comments/comments.repository';
import { SecurityDevicesRepository } from '../securityDevices/securityDevices.repository';

@Injectable()
export class TestingService {
  constructor(
    protected usersRepository: UsersRepository,
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
    protected commentsRepository: CommentsRepository,
    protected securityDevicesRepository: SecurityDevicesRepository,
  ) {}
  async deleteAllData(): Promise<boolean> {
    const usersDeleted: boolean = await this.usersRepository.deleteAllUsers();
    const blogsDeleted: boolean = await this.blogsRepository.deleteAllBlogs();
    const postsDeleted: boolean = await this.postsRepository.deleteAllPosts();
    const commentsDeleted: boolean =
      await this.commentsRepository.deleteAllComments();
    const securityDevicesDeleted: boolean =
      await this.securityDevicesRepository.deleteAll();
    return (
      usersDeleted &&
      blogsDeleted &&
      postsDeleted &&
      commentsDeleted &&
      securityDevicesDeleted
    );
  }
}
