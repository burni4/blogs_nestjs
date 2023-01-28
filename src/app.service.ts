import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'NestJS. Homework [Blogs] from Artem Narchuk';
  }
}
