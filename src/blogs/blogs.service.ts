import { Injectable } from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import { CreateBlogInputModelDto } from './dto/create-blog.dto';
import {
  OutputBlogDto,
  OutputBlogsWithPaginationDto,
} from './dto/output-blog.dto';
import { Blog } from './schemas/blogs.schemas';
import { PaginationConverter } from '../helpers/pagination';
import { UpdateBlogInputModelDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}

  async getBlogByID(blogID: string): Promise<OutputBlogDto | null> {
    const result: Blog | null = await this.blogsRepository.getBlogByID(blogID);
    if (!result) return null;
    const outputBlogDto: OutputBlogDto = new OutputBlogDto(result);
    return outputBlogDto;
  }
  async addBlog(
    createBlogDto: CreateBlogInputModelDto,
  ): Promise<OutputBlogDto | null> {
    const blog: Blog = new Blog();
    blog.fillNewBlogData(createBlogDto);
    const result: Blog | null = await this.blogsRepository.save(blog);
    if (!result) return null;
    const outputBlogDto = new OutputBlogDto(blog);
    return outputBlogDto;
  }
  async getBlogs(
    paginationParams: PaginationConverter,
  ): Promise<OutputBlogsWithPaginationDto> {
    const result: OutputBlogsWithPaginationDto =
      await this.blogsRepository.getBlogs(paginationParams);
    return result;
  }
  async deleteBlogByID(blogId: string): Promise<boolean> {
    const foundBlog: Blog | null = await this.blogsRepository.getBlogByID(
      blogId,
    );
    if (!foundBlog) return false;

    const result: boolean = await this.blogsRepository.delete(foundBlog);
    return result;
  }
  async updateBlogByID(
    blogId: string,
    inputModel: UpdateBlogInputModelDto,
  ): Promise<boolean> {
    const foundBlog: Blog | null = await this.blogsRepository.getBlogByID(
      blogId,
    );
    if (!foundBlog) return false;

    foundBlog.updateBlogData(inputModel);

    const result: Blog | null = await this.blogsRepository.update(foundBlog);

    if (!result) return false;

    return true;
  }
}
