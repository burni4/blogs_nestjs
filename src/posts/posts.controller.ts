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
  @Get()
  async getPostByID() {
    return true;
  }
  @Post()
  async addPost() {
    return true;
  }

  @Put()
  async updatePostByID() {
    return true;
  }
  @Delete(':id')
  @HttpCode(204)
  async deletePostById(@Param('id') userId: string) {
    return true;
  }
}
