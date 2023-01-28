import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersRepository } from './users/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/users.schema';

const mongoURILocalhost = 'mongodb://0.0.0.0:27017';
const dbName = 'nest-homeworks-blogs';

@Module({
  imports: [
    MongooseModule.forRoot(mongoURILocalhost, {
      dbName: dbName,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService, UsersRepository],
})
export class AppModule {}
