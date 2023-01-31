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

const mongoURILocalhost = 'mongodb://0.0.0.0:27017';
const dbName = 'nest-homeworks-blogs';
const mongoUri = process.env.mongoURIAtlas || mongoURILocalhost;
console.log(process.env.mongoURIAtlas);
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.mongoURIAtlas || mongoURILocalhost),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController, TestingController, UsersController],
  providers: [AppService, TestingService, UsersService, UsersRepository],
})
export class AppModule {}
