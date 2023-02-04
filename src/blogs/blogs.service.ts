import { Injectable } from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';

@Injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}
}
