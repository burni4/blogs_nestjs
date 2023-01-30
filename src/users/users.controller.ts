import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateUserInputModelType,
  GetUsersInputQueriesModelType,
} from './users.types';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService) {}
  @Get()
  async getUsers(@Query() query: GetUsersInputQueriesModelType) {
    const result = await this.usersService.findUsers(query);
    return result;
  }
  @Post()
  addUser(@Body() inputModel: CreateUserInputModelType) {
    return { text: 'add user' };
  }
  @Delete(':id')
  async deleteUserById(@Param('id') userId: string) {
    const result = await this.usersService.deleteUserByID(userId);
    return result;
  }
}
