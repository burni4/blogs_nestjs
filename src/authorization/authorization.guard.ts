import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(protected usersService: UsersService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    //throw new UnauthorizedException();
    //return validateRequest(request);
    return true;
  }
}

@Injectable()
export class BasicAuthGuard implements CanActivate {
  private credentials = {
    login: 'admin',
    password: 'qwerty',
  };
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const encodedAuth = Buffer.from(
      `${this.credentials.login}:${this.credentials.password}`,
    ).toString('base64');

    const validHeader = `Basic ${encodedAuth}`;

    if (validHeader !== authHeader) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
