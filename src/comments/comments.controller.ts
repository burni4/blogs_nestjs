import { Controller, Get } from '@nestjs/common';

import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(protected commentsService: CommentsService) {}

  @Get()
  async getCommentByID() {
    return true;
  }
}
