import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

jest.setTimeout(60000);
describe('AppController', () => {
  let app: INestApplication;
  let server: any;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    app.close();
  });

  describe('add user', () => {
    const createUser = {};
    it('should create new user', async () => {
      const user = await request(server).post('/users').send(createUser);
      expect(user.body).toStrictEqual({ text: 'add user' });
    });
  });
});
