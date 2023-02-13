import { IsEmail, IsString, Length, Validate } from 'class-validator';
import { ConfirmationCodeBodyValidator } from '../validators/confirmationCode-body.validator';

export class InputPasswordRecoveryDto {
  @IsEmail()
  email: string;
}

export class InputRegistrationConfirmationDto {
  @Validate(ConfirmationCodeBodyValidator)
  code: string;
}

export class InputNewPasswordDto {
  @IsString()
  @Length(6, 20)
  newPassword: string;
  @IsString()
  recoveryCode: string;
}
