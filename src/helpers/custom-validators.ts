import { BlogIdBodyValidator } from '../posts/validators/blog-id-body.validator';
import { ConfirmationCodeBodyValidator } from '../authorization/validators/confirmationCode-body.validator';
import { UserEmailConfirmationBodyValidator } from '../authorization/validators/userEmailConfirmation-body.validator';

export const customValidators = [
  BlogIdBodyValidator,
  ConfirmationCodeBodyValidator,
  UserEmailConfirmationBodyValidator,
];
