import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UsersQueryRepository } from '../../users/users.query-repository';

@ValidatorConstraint({ name: 'ConfirmationCodeBodyValidator', async: true })
export class ConfirmationCodeBodyValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}
  async validate(code: string): Promise<boolean> {
    try {
      const user = await this.usersQueryRepository.findUserByConfirmationCode(
        code,
      );
      console.log(user, '---------------validate-------------------');
      if (!user) return false;
      if (user.emailConfirmation.isConfirmed) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'User with this confirmation code does not exist. Or email is confirmed';
  }
}
