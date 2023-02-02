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

  describe('Users [POST]', () => {
    beforeAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    afterAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });

    it('Should create new user. And return status 201', async () => {
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

  describe('Users [DELETE]', () => {
    beforeAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    afterAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    let userId = '';
    it('Should create new user. Return response status 201', async () => {
      const newUser = await request(server)
        .post('/users')
        .send(inputUserDto)
        .expect(201);
      userId = newUser.body.id;
    });
    it('Should try delete non existing user. Return response status 404', async () => {
      await request(server)
        .delete('/users/' + 'UserID')
        .expect(404);
    });
    it('Should delete new user. Return response status 204', async () => {
      await request(server)
        .delete('/users/' + userId)
        .expect(204);
    });
  });

  describe('Users [GET]', () => {
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
