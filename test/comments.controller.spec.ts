import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserInputModelDto } from '../src/users/dto/create-user.dto';
import { connectExternalComponents } from '../src/main';

jest.setTimeout(600000);

const inputUserDto: CreateUserInputModelDto = {
  login: 'UserTest1',
  password: 'UserPassword1',
  email: 'usermail1@gmail.com',
};

describe('AppController', () => {
  let app: INestApplication;
  let server: any;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    connectExternalComponents(app);
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    app.close();
  });

  describe('Comments [GET]', () => {});
});
