import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import {
  OutputPostDto,
  OutputPostsWithPaginationDto,
} from './dto/output-post.dto';
import { Post } from './schemas/posts.schemas';
import { CreatePostInputModelDto } from './dto/create-post.dto';
import { UpdatePostInputModelDto } from './dto/update-post.dto';
import { PaginationConverter } from '../helpers/pagination';
import { Blog } from '../blogs/schemas/blogs.schemas';
import { BlogsRepository } from '../blogs/blogs.repository';

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected blogsRepository: BlogsRepository,
  ) {}
  async getPostByID(postId: string): Promise<OutputPostDto | null> {
    const result: Post | null = await this.postsRepository.getPostByID(postId);
    if (!result) return null;
    const outputPostDto: OutputPostDto = new OutputPostDto(result);
    return outputPostDto;
  }
  async getPosts(
    paginationParams: PaginationConverter,
    blogId = undefined,
  ): Promise<OutputPostsWithPaginationDto> {
    const paginator: PaginationConverter = new PaginationConverter(
      paginationParams,
    );
    const result: OutputPostsWithPaginationDto =
      await this.postsRepository.getPosts(paginator, blogId);
    return result;
  }
  async addPost(
    createPostDto: CreatePostInputModelDto,
    blogId: string,
  ): Promise<OutputPostDto | null> {
    createPostDto.blogId = blogId;
    const post: Post = new Post();
    post.fillNewPostData(createPostDto);
    const blog: Blog = await this.blogsRepository.getBlogByID(blogId);
    if (!blog) return null;
    post.blogName = blog.name;
    const result: Post | null = await this.postsRepository.save(post);
    if (!result) return null;
    const outputPostDto: OutputPostDto = new OutputPostDto(post);
    return outputPostDto;
  }
  async deletePostByID(postId: string): Promise<boolean> {
    const foundPost: Post | null = await this.postsRepository.getPostByID(
      postId,
    );
    if (!foundPost) return false;

    const result: boolean = await this.postsRepository.delete(foundPost);
    return result;
  }
  async updatePostByID(
    postId: string,
    inputModel: UpdatePostInputModelDto,
  ): Promise<boolean> {
    const foundPost: Post | null = await this.postsRepository.getPostByID(
      postId,
    );
    if (!foundPost) return false;

    foundPost.updatePostData(inputModel);
    const blog: Blog = await this.blogsRepository.getBlogByID(foundPost.blogId);
    foundPost.blogName = blog.name;
    const result: Post | null = await this.postsRepository.update(foundPost);

    if (!result) return false;

    return true;
  }
}
