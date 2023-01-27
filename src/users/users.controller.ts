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
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService) {}
  @Get()
  getUsers(@Query() query: GetUsersInputQueriesModelType) {
    return this.usersService.findUsers();
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
