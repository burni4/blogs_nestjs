import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserInputModelDto } from '../src/users/dto/create-user.dto';
import { connectExternalComponents } from '../src/main';

jest.setTimeout(60000);
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

  describe('All data must be cleared', () => {
    const createUser = {};
    it('All data must be deleted. And return response code 204', async () => {
      const result = await request(server).delete('/testing/all-data').send();
      expect(result.statusCode).toEqual(204);
    });
    // create user, then delete data
    it('After creating a user. clear the user table. Should return empty user array', async () => {
      const responseEmptyUsers = await request(server)
        .get('/users')
        .send()
        .expect(200);
      expect(responseEmptyUsers.body.items.length).toEqual(0);
      expect(responseEmptyUsers.body.items).toStrictEqual([]);

      const inputUserDto: CreateUserInputModelDto = {
        login: 'UserTest1',
        password: 'UserPassword1',
        email: 'usermail1@gmail.com',
      };
      const createUserResponse = await request(server)
        .post('/users')
        .send(inputUserDto);
      expect(createUserResponse.status).toBe(201);

      const responseAllUsers = await request(server)
        .get('/users')
        .send()
        .expect(200);
      expect(responseAllUsers.body.items.length).toEqual(1);

      await request(server).delete('/testing/all-data').send().expect(204);

      const responseEmptyUsersAfterRemoving = await request(server)
        .get('/users')
        .send()
        .expect(200);
      expect(responseEmptyUsersAfterRemoving.body.items.length).toEqual(0);
      expect(responseEmptyUsersAfterRemoving.body.items).toStrictEqual([]);
    });
  });
});
