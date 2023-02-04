import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './schemas/blogs.schemas';
import { PaginationConverter } from '../helpers/pagination';
import { OutputBlogsWithPaginationDto } from './dto/output-blog.dto';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>) {}

  async deleteAllBlogs(): Promise<boolean> {
    await this.BlogModel.deleteMany({});
    return true;
  }
  async save(blog: Blog): Promise<Blog | null> {
    try {
      const newBlog = new this.BlogModel({ ...blog });
      await newBlog.save();
      return blog;
    } catch (error) {
      return null;
    }
  }
  async delete(blog: Blog): Promise<boolean> {
    try {
      const result = await this.BlogModel.deleteOne({
        id: blog.id,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
  async getBlogByID(blogId: string): Promise<Blog | null> {
    const blogFromDB: BlogDocument = await this.BlogModel.findOne({
      id: blogId,
    }).exec();
    if (!blogFromDB) return null;
    const blog: Blog = Blog.blogDocumentToBlogClass(blogFromDB);
    return blog;
  }
  async getBlogs(
    paginator: PaginationConverter,
  ): Promise<OutputBlogsWithPaginationDto> {
    let filter = {};
    if (paginator.searchNameTerm) {
      filter = { name: { $regex: paginator.searchNameTerm, $options: 'i' } };
    }

    const foundBlogsInDB = await this.BlogModel.find(filter, {
      projection: { _id: 0 },
    })
      .sort({ [paginator.sortBy]: paginator.sortDirection === 'asc' ? 1 : -1 })
      .skip(paginator.getSkipCount())
      .limit(paginator.pageSize)
      .exec();

    const totalCount = await this.BlogModel.count(filter);

    return Blog.mapBlogDocumentsToOutputBlogsWithPaginationDto(
      paginator.getPageCount(totalCount),
      paginator.pageNumber,
      paginator.pageSize,
      totalCount,
      foundBlogsInDB,
    );
  }
}
