import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SecurityDevice } from './schemas/securityDevices.schema';

@Injectable()
export class SecurityDevicesRepository {
  constructor(
    @InjectModel(SecurityDevice.name)
    private SecurityDeviceModel: Model<SecurityDevice>,
  ) {}
  async save(securityDevice: SecurityDevice): Promise<SecurityDevice | null> {
    try {
      const newSecurityDevice = new this.SecurityDeviceModel({
        ...SecurityDevice,
      });
      await newSecurityDevice.save();
      return securityDevice;
    } catch (error) {
      return null;
    }
  }
  async delete(securityDevice: SecurityDevice): Promise<boolean> {
    try {
      const result = await this.SecurityDeviceModel.deleteOne({
        id: securityDevice.id,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
  async deleteAll(): Promise<boolean> {
    await this.SecurityDeviceModel.deleteMany({});
    return true;
  }
}
