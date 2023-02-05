import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CreateBlogInputModelDto } from '../dto/create-blog.dto';
import { randomUUID } from 'crypto';
import {
  OutputBlogDto,
  OutputBlogsWithPaginationDto,
} from '../dto/output-blog.dto';
import { UpdateBlogInputModelDto } from '../dto/update-blog.dto';

@Schema({ versionKey: false })
export class Blog {
  @Prop()
  id: string;
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  websiteUrl: string;
  @Prop()
  createdAt: string;
  fillNewBlogData(inputData: CreateBlogInputModelDto): void {
    this.id = randomUUID();
    this.name = inputData.name;
    this.description = inputData.description;
    this.websiteUrl = inputData.websiteUrl;
    this.createdAt = new Date().toISOString();
  }
  updateBlogData(inputData: UpdateBlogInputModelDto): void {
    this.name = inputData.name;
    this.description = inputData.description;
    this.websiteUrl = inputData.websiteUrl;
  }
  static blogDocumentToBlogClass(blogDocument: BlogDocument): Blog {
    const newBlog = new Blog();
    newBlog.id = blogDocument.id;
    newBlog.name = blogDocument.name;
    newBlog.createdAt = blogDocument.createdAt;
    newBlog.websiteUrl = blogDocument.websiteUrl;
    newBlog.description = blogDocument.description;
    return newBlog;
  }
  static mapBlogDocumentsToOutputBlogsWithPaginationDto(
    pagesCount,
    page,
    pageSize,
    totalCount,
    blogDocuments: BlogDocument[],
  ): OutputBlogsWithPaginationDto {
    const blogs: OutputBlogDto[] = [];
    blogDocuments.forEach((document) => {
      const curBlog: Blog = this.blogDocumentToBlogClass(document);
      const outputBlogDto: OutputBlogDto = new OutputBlogDto(curBlog);
      blogs.push(outputBlogDto);
    });
    const currentDto: OutputBlogsWithPaginationDto =
      new OutputBlogsWithPaginationDto(
        pagesCount,
        page,
        pageSize,
        totalCount,
        blogs,
      );
    return currentDto;
  }
}

export type BlogDocument = HydratedDocument<Blog>;
export const BlogSchema = SchemaFactory.createForClass(Blog);
