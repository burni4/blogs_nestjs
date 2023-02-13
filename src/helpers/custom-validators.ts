import { BlogIdBodyValidator } from '../posts/validators/blog-id-body.validator';
import { ConfirmationCodeBodyValidator } from '../authorization/validators/confirmationCode-body.validator';

export const customValidators = [
  BlogIdBodyValidator,
  ConfirmationCodeBodyValidator,
];
