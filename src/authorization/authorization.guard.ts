import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from './applications/jwt-service';
import { User } from '../users/schemas/users.schema';
import { UsersQueryRepository } from '../users/users.query-repository';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(
    protected usersQueryRepository: UsersQueryRepository,
    protected jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      throw new UnauthorizedException();
    }
    let token = request.headers.authorization.split(' ')[1];
    token = this.jwtService.verifyToken(token);
    if (!token) {
      throw new UnauthorizedException();
    }
    const userId = this.jwtService.getUserIdFromTokenPayload(token);
    if (!userId) {
      throw new UnauthorizedException();
    }
    const user: User | null = await this.usersQueryRepository.findUserByID(
      userId,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    request.user = user;

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
