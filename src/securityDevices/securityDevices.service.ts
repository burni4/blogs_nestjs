import { Injectable } from '@nestjs/common';
import { SecurityDevicesRepository } from './securityDevices.repository';

@Injectable()
export class SecurityDevicesService {
  constructor(protected securityDevicesRepository: SecurityDevicesRepository) {}
  async deleteAll(): Promise<boolean> {
    return await this.securityDevicesRepository.deleteAll();
  }
}
