import { ConfigModule } from '@nestjs/config';
const configModule = ConfigModule.forRoot();

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersRepository } from './users/users.repository';
import { MongooseModule } from '@nestjs/mongoose';

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
import { AuthorizationController } from './authorization/authorization.controller';
import { customValidators } from './helpers/custom-validators';
import {
  SecurityDevice,
  SecurityDeviceSchema,
} from './securityDevices/schemas/securityDevices.schema';
import { SecurityDevicesController } from './securityDevices/securityDevices.controller';
import { SecurityDevicesService } from './securityDevices/securityDevices.service';
import { SecurityDevicesRepository } from './securityDevices/securityDevices.repository';
import { JwtService } from './authorization/applications/jwt-service';
import { EmailAdapter } from './authorization/adapters/email-adapter';
import { EmailManager } from './authorization/managers/email-manager';
import { UsersQueryRepository } from './users/users.query-repository';
import { BcryptService } from './authorization/applications/bcrypt-service';

const mongoURILocalhost = 'mongodb://0.0.0.0:27017';
const dbName = 'nest-homeworks-blogs';
const mongoUri = process.env.mongoURIAtlas || mongoURILocalhost;

const mongoSchemas = [
  { name: User.name, schema: UserSchema },
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
  { name: CommentManager.name, schema: CommentSchema },
  { name: SecurityDevice.name, schema: SecurityDeviceSchema },
];
@Module({
  imports: [
    configModule,
    MongooseModule.forRoot(mongoUri),
    MongooseModule.forFeature(mongoSchemas),
  ],
  controllers: [
    AppController,
    TestingController,
    UsersController,
    BlogsController,
    PostsController,
    CommentsController,
    SecurityDevicesController,
    AuthorizationController,
  ],
  providers: [
    AppService,
    TestingService,
    BcryptService,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    BlogsService,
    BlogsRepository,
    PostsService,
    PostsRepository,
    CommentsService,
    CommentsRepository,
    SecurityDevicesController,
    SecurityDevicesService,
    SecurityDevicesRepository,
    JwtService,
    EmailAdapter,
    EmailManager,
    ...customValidators,
  ],
})
export class AppModule {}
