import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { OutputPostDto } from './dto/output-post.dto';
import { CreatePostInputModelDto } from './dto/create-post.dto';
import { UpdatePostInputModelDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(protected postsService: PostsService) {}
  @Get()
  async getPosts() {
    return true;
  }
  @Get()
  async getAllCommentsByPostID() {
    return true;
  }
  @Get(':id')
  async getPostByID(@Param('id') postId: string) {
    const result: OutputPostDto | null = await this.postsService.getPostByID(
      postId,
    );
    if (!result) throw new NotFoundException();
    return result;
  }
  @Post()
  async addPost(@Body() inputModel: CreatePostInputModelDto) {
    const result: OutputPostDto | null = await this.postsService.addPost(
      inputModel,
    );
    return result;
  }

  @Put(':id')
  @HttpCode(204)
  async updatePostByID(
    @Param('id') postId: string,
    @Body() inputModel: UpdatePostInputModelDto,
  ) {
    const result: boolean = await this.postsService.updatePostByID(
      postId,
      inputModel,
    );
    if (!result) throw new NotFoundException();
  }
  @Delete(':id')
  @HttpCode(204)
  async deletePostById(@Param('id') postId: string) {
    const result: boolean = await this.postsService.deletePostByID(postId);
    if (!result) throw new NotFoundException();
    return true;
  }
}
