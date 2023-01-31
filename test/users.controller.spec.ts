import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserInputModelDto } from '../src/users/dto/create-user.dto';
import { OutputUserDto } from '../src/users/dto/output-user.dto';

jest.setTimeout(600000);
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
    beforeAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    afterAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });

    it('should create new user', async () => {
      const inputUserDto: CreateUserInputModelDto = {
        login: 'UserTest1',
        password: 'UserPassword1',
        email: 'usermail1@gmail.com',
      };
      const outputUserDto: OutputUserDto = {
        id: expect.any(String),
        login: inputUserDto.login,
        email: inputUserDto.email,
        createdAt: expect.any(String),
      };
      const createUserResponse = await request(server)
        .post('/users')
        .send(inputUserDto)
        .expect(201);
      expect(createUserResponse.body).toStrictEqual(outputUserDto);
    });
  });
});
