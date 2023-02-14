import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptService {
  async generateSalt() {
    return await bcrypt.genSalt(10);
  }
  async generateHash(password: string, passwordSalt: string) {
    return await bcrypt.hash(password, passwordSalt);
  }

  async checkCredentialsPasswordHash(
    passwordHash: string,
    passwordSalt: string,
    password: string,
  ): Promise<boolean> {
    return passwordHash === (await this.generateHash(password, passwordSalt));
  }
}
