import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './schemas/blogs.schemas';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>) {}

  async save(blog: Blog): Promise<Blog | null> {
    try {
      const newBlog = new this.BlogModel({ ...blog });
      await newBlog.save();
      return blog;
    } catch (error) {
      return null;
    }
  }
}
