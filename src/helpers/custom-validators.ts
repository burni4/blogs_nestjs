import { BlogIdBodyValidator } from '../posts/validators/blog-id-body.validator';
import { ConfirmationCodeBodyValidator } from '../authorization/validators/confirmationCode-body.validator';
import { UserEmailConfirmationBodyValidator } from '../authorization/validators/userEmailConfirmation-body.validator';
import { EmailAlreadyExistsBodyValidator } from '../authorization/validators/emailAlreadyExists-body.validator';
import { LoginAlreadyExistsBodyValidator } from '../authorization/validators/loginAlreadyExists-body.validator';

export const customValidators = [
  BlogIdBodyValidator,
  ConfirmationCodeBodyValidator,
  UserEmailConfirmationBodyValidator,
  EmailAlreadyExistsBodyValidator,
  LoginAlreadyExistsBodyValidator,
];
