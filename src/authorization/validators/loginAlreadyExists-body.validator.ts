import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UsersQueryRepository } from '../../users/users.query-repository';

@ValidatorConstraint({ name: 'LoginAlreadyExistsBodyValidator', async: true })
export class LoginAlreadyExistsBodyValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}
  async validate(login: string): Promise<boolean> {
    try {
      const user = await this.usersQueryRepository.findByLoginOrEmail(login);
      if (user) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Login already exists';
  }
}
