import jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { User } from '../../users/schemas/users.schema';

const JWT_SECRET_LOCAL = 'JWT_SECRET';

const JWT_SECRET = process.env.JWT_SECRET || JWT_SECRET_LOCAL;
@Injectable()
export class JwtService {
  createAccessJWT(userId: string) {
    return jwt.sign({ userId: userId }, JWT_SECRET, { expiresIn: '10m' });
  }
  createRefreshJWT(userId: string, deviceId = '') {
    return jwt.sign({ userId: userId, deviceId: deviceId }, JWT_SECRET, {
      expiresIn: '20m',
    });
  }
  verifyToken(token: string) {
    try {
      const result: any = jwt.verify(token, JWT_SECRET);
      return result;
    } catch (error) {
      return null;
    }
  }
  getUserIdFromTokenPayload(token) {
    return token.userId;
  }
  generateNewTokens(user: User): Tokens {
    const tokens: Tokens = new Tokens(
      this.createAccessJWT(user.id),
      this.createRefreshJWT(user.id),
    );
    return tokens;
  }
}

export class Tokens {
  accessToken: string;
  refreshToken: string;
  constructor(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
