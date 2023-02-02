import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationConverter } from '../helpers/pagination';
import { CreateUserInputModelDto } from './dto/create-user.dto';
import { OutputUserDto } from './dto/output-user.dto';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService) {}
  @Get()
  async getUsers(@Query() query: PaginationConverter) {
    const result = await this.usersService.findUsers(query);
    return result;
  }
  @Post()
  async addUser(@Body() inputModel: CreateUserInputModelDto) {
    const result: OutputUserDto | null = await this.usersService.addUsers(
      inputModel,
    );
    return result;
  }
  @Delete(':id')
  @HttpCode(204)
  async deleteUserById(@Param('id') userId: string) {
    const result = await this.usersService.deleteUserByID(userId);
    if (!result) throw new NotFoundException();
    return result;
  }
}
