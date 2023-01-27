import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { CreateUserInputModelType } from './users.types';

@Controller('users')
export class UsersController {
  @Get()
  getUsers() {
    return 'get users';
  }
  @Post()
  addUser(@Body() inputModel: CreateUserInputModelType) {
    return 'add user';
  }
  @Delete()
  deleteUserById() {
    return 'delete user';
  }
}
