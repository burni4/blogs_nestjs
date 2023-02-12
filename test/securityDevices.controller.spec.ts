import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserInputModelDto } from '../src/users/dto/create-user.dto';
import {
  OutputUserDto,
  OutputUsersWithPaginationDto,
} from '../src/users/dto/output-user.dto';
import { connectExternalComponents } from '../src/main';

jest.setTimeout(600000);

describe('AppController', () => {
  let app: INestApplication;
  let server: any;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app = connectExternalComponents(app);

    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    app.close();
  });
});
