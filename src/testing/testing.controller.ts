import { Controller, Delete, HttpCode, Param } from '@nestjs/common';
import { TestingService } from './testing.service';

@Controller('testing')
export class TestingController {
  constructor(protected testingService: TestingService) {}
  @Delete('all-data')
  @HttpCode(204)
  async deleteAllData() {
    const result = await this.testingService.deleteAllData();
  }
}
