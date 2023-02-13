import jwt from 'jsonwebtoken';

const JWT_SECRET_LOCAL = 'JWT_SECRET';

const JWT_SECRET = process.env.JWT_SECRET || JWT_SECRET_LOCAL;

export class JwtService {
  createAccessJWT(userId: string) {
    return jwt.sign({ userId: userId }, JWT_SECRET, { expiresIn: '10m' });
  }
  createRefreshJWT(userId: string, deviceId: string) {
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
}
