import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from './authorization.guard';

@Controller('auth')
export class AuthorizationController {
  @UseGuards(JWTAuthGuard)
  @Get('/me')
  async getInformationAboutCurrentUser() {}
  @Post('/password-recovery')
  async sendPasswordRecoveryCodeOnEmail() {}
  @Post('/new-password')
  async updatePasswordByRecoveryCode() {}
  @Post('/login')
  async loginUser() {}
  @Post('/refresh-token')
  async updateRefreshToken() {}
  @Post('/registration-confirmation')
  async confirmEmailByCode() {}
  @Post('/registration')
  async registerUser() {}
  @Post('/registration-email-resending')
  async resendConfirmationCodeOnEmail() {}
  @Post('/logout')
  async logoutUser() {}
}
