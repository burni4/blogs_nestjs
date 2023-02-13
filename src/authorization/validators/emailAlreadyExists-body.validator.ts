import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UsersQueryRepository } from '../../users/users.query-repository';

@ValidatorConstraint({ name: 'EmailAlreadyExistsBodyValidator', async: true })
export class EmailAlreadyExistsBodyValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}
  async validate(email: string): Promise<boolean> {
    try {
      const user = await this.usersQueryRepository.findByLoginOrEmail(email);
      if (user) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Email already exists';
  }
}
