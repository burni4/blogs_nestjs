import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import {
  User,
  UserEmailConfirmation,
  UserRecoveryCode,
} from './schemas/users.schema';
import { CreateUserInputModelDto } from './dto/create-user.dto';
import { PaginationConverter } from '../helpers/pagination';
import {
  OutputUserDto,
  OutputUsersWithPaginationDto,
} from './dto/output-user.dto';
import { EmailManager } from '../authorization/managers/email-manager';
import {
  InputLoginDto,
  InputNewPasswordDto,
  InputPasswordRecoveryDto,
  InputRegistrationConfirmationDto,
} from '../authorization/dto/input-authorization.dto';
import { UsersQueryRepository } from './users.query-repository';
import { BcryptService } from '../authorization/applications/bcrypt-service';

@Injectable()
export class UsersService {
  constructor(
    protected usersRepository: UsersRepository,
    protected usersQueryRepository: UsersQueryRepository,
    protected emailManager: EmailManager,
    protected bcryptService: BcryptService,
  ) {}

  async deleteAllUsers(): Promise<boolean> {
    return await this.usersRepository.deleteAllUsers();
  }

  async findUsers(
    paginationParams: PaginationConverter,
  ): Promise<OutputUsersWithPaginationDto> {
    return await this.usersQueryRepository.findUsers(paginationParams);
  }

  async addUser(
    createUserDto: CreateUserInputModelDto,
  ): Promise<OutputUserDto | null> {
    //throw new BadRequestException();

    const user: User = new User();
    await user.fillNewUserData(createUserDto);
    user.accountData.passwordSalt = await this.bcryptService.generateSalt();
    user.accountData.passwordHash = await this.bcryptService.generateHash(
      createUserDto.password,
      user.accountData.passwordSalt,
    );
    const result: User | null = await this.usersRepository.save(user);
    if (!result) return null;

    try {
      await this.emailManager.sendEmailConfirmationMessage(
        user.emailConfirmation.confirmationCode,
        user.accountData.email,
      );
    } catch {
      await this.usersRepository.delete(user);
      return null;
    }

    const outputUserDto = new OutputUserDto(user);
    return outputUserDto;
  }

  async deleteUserByID(userId: string): Promise<boolean> {
    const foundUser: User | null = await this.usersQueryRepository.findUserByID(
      userId,
    );
    if (!foundUser) return false;

    const result: boolean = await this.usersRepository.delete(foundUser);

    return result;
  }

  async sendPasswordRecoveryCodeOnEmail(
    inputModel: InputPasswordRecoveryDto,
  ): Promise<boolean> {
    const foundUser: User | null =
      await this.usersQueryRepository.findUserByEmail(inputModel.email);
    if (!foundUser) return false;

    const recoveryCodeObj: UserRecoveryCode = foundUser.addRecoveryCode();

    const result: User | null = await this.usersRepository.save(foundUser);

    try {
      await this.emailManager.sendEmailRecoveryPasswordMessage(
        recoveryCodeObj.recoveryCode,
        inputModel.email,
      );
    } catch {
      return false;
    }

    return true;
  }
  async updatePassword(inputModel: InputNewPasswordDto): Promise<boolean> {
    const user: User | null =
      await this.usersQueryRepository.findUserByRecoveryCode(
        inputModel.recoveryCode,
      );

    if (!user) return false;

    if (!user.recoveryCodeIsValid(inputModel.recoveryCode)) return false;

    user.accountData.passwordSalt = await this.bcryptService.generateSalt();
    user.accountData.passwordHash = await this.bcryptService.generateHash(
      inputModel.newPassword,
      user.accountData.passwordSalt,
    );

    user.deleteAllRecoveryCodes();

    await this.usersRepository.save(user);

    return true;
  }

  async confirmEmailByCode(
    inputModel: InputRegistrationConfirmationDto,
  ): Promise<boolean> {
    const user: User | null =
      await this.usersQueryRepository.findUserByConfirmationCode(
        inputModel.code,
      );
    if (!user) return false;

    const result: boolean = user.confirmEmailByCode(inputModel.code);

    if (!result) return false;

    await this.usersRepository.save(user);

    return true;
  }
  async checkCredentials(inputModel: InputLoginDto): Promise<User | null> {
    const foundUser: User | null =
      await this.usersQueryRepository.findByLoginOrEmail(
        inputModel.loginOrEmail,
      );
    if (!foundUser) return null;

    const result: boolean =
      await this.bcryptService.checkCredentialsPasswordHash(
        foundUser.accountData.passwordHash,
        foundUser.accountData.passwordSalt,
        inputModel.password,
      );

    if (!result) return null;

    return foundUser;
  }
}
