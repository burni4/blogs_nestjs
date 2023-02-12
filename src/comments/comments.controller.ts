import { Controller, Delete, Get, Put } from '@nestjs/common';

import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(protected commentsService: CommentsService) {}

  @Get()
  async getCommentByID() {
    return true;
  }
  @Put()
  async updateCommentByID() {
    return true;
  }
  @Delete()
  async deleteCommentByID() {
    return true;
  }
  @Put()
  async updateLikeStatus() {
    return true;
  }
}
