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
import { BlogsService } from './blogs.service';

@Controller('blogs')
export class BlogsController {
  constructor(protected blogsService: BlogsService) {}
  @Get()
  async getBlogs() {
    return true;
  }
  @Get()
  async getAllPostsByBlogID() {
    return true;
  }
  @Get()
  async getBlogByID() {
    return true;
  }
  @Post()
  async addBlog() {
    return true;
  }
  @Post()
  async addPostByBlogID() {
    return true;
  }
  @Put()
  async updateBlogByID() {
    return true;
  }
  @Delete(':id')
  @HttpCode(204)
  async deleteBlogById(@Param('id') userId: string) {
    return true;
  }
}
