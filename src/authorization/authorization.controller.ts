import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JWTAuthGuard } from './authorization.guard';
import { GetUserFromRequest } from '../helpers/custom-decorators';
import { User } from '../users/schemas/users.schema';
import {
  OutputUserDto,
  OutputUserInformationDto,
} from '../users/dto/output-user.dto';
import { UsersService } from '../users/users.service';
import { CreateUserInputModelDto } from '../users/dto/create-user.dto';
import {
  InputNewPasswordDto,
  InputPasswordRecoveryDto,
  InputRegistrationConfirmationDto,
} from './dto/authorization.dto';

@Controller('auth')
export class AuthorizationController {
  constructor(protected usersService: UsersService) {}
  @UseGuards(JWTAuthGuard)
  @Get('/me')
  async getInformationAboutCurrentUser(@GetUserFromRequest() user: User) {
    if (!user) {
      throw new UnauthorizedException();
    }
    const outputUser: OutputUserInformationDto = new OutputUserInformationDto(
      user,
    );
    return outputUser;
  }
  @Post('/registration')
  async registerUser(@Body() inputModel: CreateUserInputModelDto) {
    const outputUserDto: OutputUserDto | null = await this.usersService.addUser(
      inputModel,
    );
  }
  @Post('/password-recovery')
  async sendPasswordRecoveryCodeOnEmail(
    @Body() inputModel: InputPasswordRecoveryDto,
  ) {
    const mailSend: boolean =
      await this.usersService.sendPasswordRecoveryCodeOnEmail(inputModel);
  }
  @Post('/new-password')
  async updatePasswordByRecoveryCode(@Body() inputModel: InputNewPasswordDto) {
    const passwordUpdated: boolean = await this.usersService.updatePassword(
      inputModel,
    );
  }
  @Post('/registration-confirmation')
  async confirmEmailByCode(
    @Body() inputModel: InputRegistrationConfirmationDto,
  ) {
    const mailConfirmed: boolean = await this.usersService.confirmEmailByCode(
      inputModel,
    );
  }

  @Post('/login')
  async loginUser() {}
  @Post('/refresh-token')
  async updateRefreshToken() {}

  @Post('/registration-email-resending')
  async resendConfirmationCodeOnEmail() {}
  @Post('/logout')
  async logoutUser() {}
}
