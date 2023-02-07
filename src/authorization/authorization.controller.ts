import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthorizationController {
  @Get('/me')
  async getInformationAboutCurrentUser() {}
}
