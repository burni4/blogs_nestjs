import { Controller, Delete, Get } from '@nestjs/common';
import { SecurityDevicesService } from './securityDevices.service';

@Controller('users')
export class SecurityDevicesController {
  constructor(protected securityDevicesService: SecurityDevicesService) {}
  @Get()
  async findUserDevicesByRefreshToken() {}
  @Delete()
  async deleteAllUserSessionsExcludeCurrent() {}
  @Delete()
  async deleteUserSessionByDeviceId() {}
}
