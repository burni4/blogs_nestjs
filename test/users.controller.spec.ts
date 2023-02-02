import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserInputModelDto } from '../src/users/dto/create-user.dto';
import { OutputUserDto } from '../src/users/dto/output-user.dto';

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

    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    app.close();
  });

  describe('add new user', () => {
    beforeAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    afterAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });

    it('should create new user', async () => {
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

  describe('Delete user', () => {
    beforeAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    afterAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });

    it('should delete new user', async () => {
      const newUser = await request(server)
        .post('/users')
        .send(inputUserDto)
        .expect(201);

      await request(server)
        .delete('/users/' + 'UserID')
        .expect(404);

      await request(server)
        .delete('/users/' + newUser.body.id)
        .expect(204);
    });
  });

  describe('Should get all users', () => {
    beforeAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    afterAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    it('should return status 200 when GET all users', async () => {
      await request(server).get('/users').send().expect(200);
    });
  });
});
