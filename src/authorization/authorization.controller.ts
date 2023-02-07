import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './authorization.guard';
@UseGuards(AuthGuard)
@Controller('auth')
export class AuthorizationController {
  @Get('/me')
  async getInformationAboutCurrentUser() {}
}
