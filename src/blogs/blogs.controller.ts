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
import { CreateBlogInputModelDto } from './dto/create-blog.dto';
import {
  OutputBlogDto,
  OutputBlogsWithPaginationDto,
} from './dto/output-blog.dto';
import { PaginationConverter } from '../helpers/pagination';

@Controller('blogs')
export class BlogsController {
  constructor(protected blogsService: BlogsService) {}
  @Get()
  async getBlogs(@Query() query: PaginationConverter) {
    const result: OutputBlogsWithPaginationDto =
      await this.blogsService.getBlogs(query);
    return result;
  }
  @Get()
  async getAllPostsByBlogID() {
    return true;
  }
  @Get(':id')
  async getBlogByID(@Param('id') blogId: string) {
    const result: OutputBlogDto | null = await this.blogsService.getBlogByID(
      blogId,
    );
    if (!result) throw new NotFoundException();
    return result;
  }
  @Post()
  async addBlog(@Body() inputModel: CreateBlogInputModelDto) {
    const result: OutputBlogDto | null = await this.blogsService.addBlog(
      inputModel,
    );
    return result;
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
