import {
  Body,
  Controller,
  Get,
  HttpCode,
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
  InputLoginDto,
  InputNewPasswordDto,
  InputPasswordRecoveryDto,
  InputRegistrationConfirmationDto,
  InputRegistrationEmailResendingDto,
} from './dto/input-authorization.dto';
import { JwtService, Tokens } from './applications/jwt-service';
import { OutputLoginDto } from './dto/output-authorization.dto';

@Controller('auth')
export class AuthorizationController {
  constructor(
    protected usersService: UsersService,
    protected jwtService: JwtService,
  ) {}
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
  @HttpCode(204)
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

  @Post('/registration-email-resending')
  async resendConfirmationCodeOnEmail(
    @Body() inputModel: InputRegistrationEmailResendingDto,
  ) {
    const mailSend: boolean =
      await this.usersService.sendPasswordRecoveryCodeOnEmail(inputModel);
  }

  @Post('/login')
  @HttpCode(200)
  async loginUser(@Body() inputModel: InputLoginDto) {
    const user: User | null = await this.usersService.checkCredentials(
      inputModel,
    );
    if (!user) throw new UnauthorizedException();

    const tokens: Tokens = this.jwtService.generateNewTokens(user);

    return new OutputLoginDto(tokens.accessToken);
  }
  @Post('/refresh-token')
  async updateRefreshToken() {}

  @Post('/logout')
  async logoutUser() {}
}
