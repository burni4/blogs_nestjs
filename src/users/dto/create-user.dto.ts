import { IsEmail, IsString, Length, Validate } from 'class-validator';

export class CreateUserInputModelDto {
  @IsString()
  @Length(3, 10)
  login: string;
  @IsString()
  @Length(6, 20)
  password: string;
  @IsString()
  @IsEmail()
  email: string;
}
