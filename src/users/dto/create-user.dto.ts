import { IsEmail, IsString, Length, Validate } from 'class-validator';
import { LoginAlreadyExistsBodyValidator } from '../../authorization/validators/loginAlreadyExists-body.validator';
import { EmailAlreadyExistsBodyValidator } from '../../authorization/validators/emailAlreadyExists-body.validator';

export class CreateUserInputModelDto {
  @Validate(LoginAlreadyExistsBodyValidator)
  @IsString()
  @Length(3, 10)
  login: string;
  @IsString()
  @Length(6, 20)
  password: string;
  @Validate(EmailAlreadyExistsBodyValidator)
  @IsString()
  @IsEmail()
  email: string;
}
