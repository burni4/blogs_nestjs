import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { OutputPostDto } from './dto/output-post.dto';
import { Post } from './schemas/posts.schemas';
import { CreatePostInputModelDto } from './dto/create-post.dto';
import { UpdatePostInputModelDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(protected postsRepository: PostsRepository) {}
  async getPostByID(postId: string): Promise<OutputPostDto | null> {
    const result: Post | null = await this.postsRepository.getPostByID(postId);
    if (!result) return null;
    const outputPostDto: OutputPostDto = new OutputPostDto(result);
    return outputPostDto;
  }
  async addPost(
    createPostDto: CreatePostInputModelDto,
  ): Promise<OutputPostDto | null> {
    const post: Post = new Post();
    post.fillNewPostData(createPostDto);
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

    const result: Post | null = await this.postsRepository.update(foundPost);

    if (!result) return false;

    return true;
  }
}
