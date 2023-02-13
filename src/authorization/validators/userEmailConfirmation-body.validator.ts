import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UsersQueryRepository } from '../../users/users.query-repository';
import { User } from '../../users/schemas/users.schema';

@ValidatorConstraint({
  name: 'UserEmailConfirmationBodyValidator',
  async: true,
})
export class UserEmailConfirmationBodyValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}
  async validate(email: string): Promise<boolean> {
    try {
      const user: User = await this.usersQueryRepository.findUserByEmail(email);
      if (!user) return false;
      if (user.emailConfirmation.isConfirmed) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'User with this email not exist. Or email is confirmed';
  }
}
