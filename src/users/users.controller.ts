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
import { query } from 'express';

@Controller('users')
export class UsersController {
  @Get()
  getUsers(@Query() query: GetUsersInputQueriesModelType) {
    return 'get users';
  }
  @Post()
  addUser(@Body() inputModel: CreateUserInputModelType) {
    return 'add user';
  }
  @Delete(':id')
  deleteUserById(@Param('id') userId: string) {
    return 'delete user';
  }
}
