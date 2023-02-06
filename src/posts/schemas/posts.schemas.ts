import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';
import { CreatePostInputModelDto } from '../dto/create-post.dto';
import { UpdateBlogInputModelDto } from '../../blogs/dto/update-blog.dto';
import { UpdatePostInputModelDto } from '../dto/update-post.dto';

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
    //TODO get blog name by blogId
    this.blogName = '';
    this.createdAt = new Date().toISOString();
  }

  updatePostData(inputData: UpdatePostInputModelDto): void {
    this.title = inputData.title;
    this.shortDescription = inputData.shortDescription;
    this.blogId = inputData.blogId;
    this.content = inputData.content;
  }
}

export type PostDocument = HydratedDocument<Post>;
export const PostSchema = SchemaFactory.createForClass(Post);
