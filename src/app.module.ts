import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersRepository } from './users/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from './users/schemas/users.schema';
import { TestingController } from './testing/testing.controller';
import { TestingService } from './testing/testing.service';
import { Blog, BlogSchema } from './blogs/schemas/blogs.schemas';
import { Post, PostSchema } from './posts/schemas/posts.schemas';
import {
  CommentManager,
  CommentSchema,
} from './comments/schemas/comments.schemas';
import { BlogsController } from './blogs/blogs.controller';
import { PostsController } from './posts/posts.controller';
import { CommentsController } from './comments/comments.controller';
import { BlogsService } from './blogs/blogs.service';
import { BlogsRepository } from './blogs/blogs.repository';
import { PostsService } from './posts/posts.service';
import { PostsRepository } from './posts/posts.repository';
import { CommentsService } from './comments/comments.service';
import { CommentsRepository } from './comments/comments.repository';

const mongoURILocalhost = 'mongodb://0.0.0.0:27017';
const dbName = 'nest-homeworks-blogs';
const mongoUri = process.env.mongoURIAtlas || mongoURILocalhost;
console.log(process.env.mongoURIAtlas);
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.mongoURIAtlas || mongoURILocalhost),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([
      { name: CommentManager.name, schema: CommentSchema },
    ]),
  ],
  controllers: [
    AppController,
    TestingController,
    UsersController,
    BlogsController,
    PostsController,
    CommentsController,
  ],
  providers: [
    AppService,
    TestingService,
    UsersService,
    UsersRepository,
    BlogsService,
    BlogsRepository,
    PostsService,
    PostsRepository,
    CommentsService,
    CommentsRepository,
  ],
})
export class AppModule {}
