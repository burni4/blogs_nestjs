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
import { UpdateBlogInputModelDto } from './dto/update-blog.dto';
import {
  OutputPostDto,
  OutputPostsWithPaginationDto,
} from '../posts/dto/output-post.dto';
import { PostsService } from '../posts/posts.service';
import { CreatePostInputModelDto } from '../posts/dto/create-post.dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected postsService: PostsService,
  ) {}
  @Get()
  async getBlogs(@Query() query: PaginationConverter) {
    const result: OutputBlogsWithPaginationDto =
      await this.blogsService.getBlogs(query);
    return result;
  }
  @Get(':id/posts')
  async getAllPostsByBlogID(
    @Param('id') blogId: string,
    @Query() query: PaginationConverter,
  ) {
    //TODO create e2e tests
    const foundBlog: OutputBlogDto | null = await this.blogsService.getBlogByID(
      blogId,
    );
    if (!foundBlog) throw new NotFoundException();
    const result: OutputPostsWithPaginationDto =
      await this.postsService.getPosts(query, blogId);
    return result;
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
  @Post(':id/posts')
  async addPostByBlogID(
    @Param('id') blogId: string,
    @Body() inputModel: CreatePostInputModelDto,
  ) {
    //TODO create e2e tests
    const foundBlog: OutputBlogDto | null = await this.blogsService.getBlogByID(
      blogId,
    );
    if (!foundBlog) throw new NotFoundException();
    const result: OutputPostDto | null = await this.postsService.addPost(
      inputModel,
      blogId,
    );
    return result;
  }
  @Put(':id')
  @HttpCode(204)
  async updateBlogByID(
    @Param('id') blogId: string,
    @Body() inputModel: UpdateBlogInputModelDto,
  ) {
    const result: boolean = await this.blogsService.updateBlogByID(
      blogId,
      inputModel,
    );
    if (!result) throw new NotFoundException();
  }
  @Delete(':id')
  @HttpCode(204)
  async deleteBlogById(@Param('id') blogId: string) {
    const result: boolean = await this.blogsService.deleteBlogByID(blogId);
    if (!result) throw new NotFoundException();
    return true;
  }
}
