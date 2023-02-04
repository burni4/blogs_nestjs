import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserInputModelDto } from '../src/users/dto/create-user.dto';
import {
  OutputUserDto,
  OutputUsersWithPaginationDto,
} from '../src/users/dto/output-user.dto';

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

    it('Should create new user. And return status 201 [POST]', async () => {
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
    it('Should create new user. Return response status 201 [POST]', async () => {
      const newUser = await request(server)
        .post('/users')
        .send(inputUserDto)
        .expect(201);
      userId = newUser.body.id;
    });

    it('Should try delete non existing user. Return response status 404 [DELETE]', async () => {
      await request(server)
        .delete('/users/' + 'UserID')
        .expect(404);
    });
    it('Should delete new user. Return response status 204 [DELETE]', async () => {
      await request(server)
        .delete('/users/' + userId)
        .expect(204);
    });

    it('should return a 404 status after receiving a deleted user [GET]', async () => {
      await request(server)
        .get('/users/' + userId)
        .expect(404);
    });
    it('Should return 0 users on page. Status 200 [GET]', async () => {
      const users = await request(server)
        .get('/users')
        .send()
        .query({ pageNumber: 1, pageSize: 1 })
        .expect(200);
      expect(users.body.items.length).toBe(0);
    });
  });

  describe('Users [GET]. Get all users', () => {
    beforeAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    afterAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    it('should return status 200 when GET all users', async () => {
      await request(server).get('/users').send().expect(200);
    });
    it('should return empty array with default users pagination. Status 200 [GET]', async () => {
      const emptyUsers = await request(server).get('/users').send().expect(200);
      const defaultOutputDTO: OutputUsersWithPaginationDto =
        new OutputUsersWithPaginationDto(0, 1, 10, 0, []);
      expect(emptyUsers.body).toEqual(defaultOutputDTO);
    });
    it('Create 20 new users. All response statuses should be 201 [POST]', async () => {
      for (let step = 0; step < 20; step++) {
        await request(server).post('/users').send(inputUserDto).expect(201);
      }
    });
    it('Should return 2 users on page. Status 200 [GET]', async () => {
      const users = await request(server)
        .get('/users')
        .send()
        .query({ pageNumber: 1, pageSize: 2 })
        .expect(200);
      expect(users.body.page).toBe(1);
      expect(users.body.pageSize).toBe(2);
      expect(users.body.pagesCount).toBe(10);
      expect(users.body.totalCount).toBe(20);
      expect(users.body.items.length).toEqual(2);
    });
  });
});
