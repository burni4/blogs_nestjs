import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';
import { CreatePostInputModelDto } from '../dto/create-post.dto';
import { UpdatePostInputModelDto } from '../dto/update-post.dto';
import {
  OutputPostDto,
  OutputPostsWithPaginationDto,
} from '../dto/output-post.dto';

@Schema({ versionKey: false })
export class Post {
  @Prop()
  id: string;
  @Prop()
  title: string;
  @Prop()
  shortDescription: string;
  @Prop()
  content: string;
  @Prop()
  blogId: string;
  @Prop()
  blogName: string;
  @Prop()
  createdAt: string;

  static postDocumentToPostClass(postDocument: PostDocument): Post {
    const newPost = new Post();
    newPost.id = postDocument.id;
    newPost.title = postDocument.title;
    newPost.shortDescription = postDocument.shortDescription;
    newPost.content = postDocument.content;
    newPost.blogId = postDocument.blogId;
    newPost.blogName = postDocument.blogName;
    newPost.createdAt = postDocument.createdAt;
    return newPost;
  }
  fillNewPostData(inputData: CreatePostInputModelDto): void {
    this.id = randomUUID();
    this.title = inputData.title;
    this.shortDescription = inputData.shortDescription;
    this.content = inputData.content;
    this.blogId = inputData.blogId;
    this.createdAt = new Date().toISOString();
  }

  updatePostData(inputData: UpdatePostInputModelDto): void {
    this.title = inputData.title;
    this.shortDescription = inputData.shortDescription;
    this.blogId = inputData.blogId;
    this.content = inputData.content;
  }
  static mapPostDocumentsToOutputPostsWithPaginationDto(
    pagesCount,
    page,
    pageSize,
    totalCount,
    postDocuments: PostDocument[],
  ): OutputPostsWithPaginationDto {
    const posts: OutputPostDto[] = [];
    postDocuments.forEach((document) => {
      const curPost: Post = this.postDocumentToPostClass(document);
      const outputPostDto: OutputPostDto = new OutputPostDto(curPost);
      posts.push(outputPostDto);
    });
    const currentDto: OutputPostsWithPaginationDto =
      new OutputPostsWithPaginationDto(
        pagesCount,
        page,
        pageSize,
        totalCount,
        posts,
      );
    return currentDto;
  }
}

export type PostDocument = HydratedDocument<Post>;
export const PostSchema = SchemaFactory.createForClass(Post);
