import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreatePostInputModelDto } from '../src/posts/dto/create-post.dto';
import { OutputPostDto } from '../src/posts/dto/output-post.dto';

jest.setTimeout(600000);

const createInputPostDto: CreatePostInputModelDto = {
  title: 'PostTitleTest1',
  shortDescription: 'PostShortDescriptionTest1',
  content: 'PostContentTest1',
  blogId: '',
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

  describe('Posts [POST]', () => {
    beforeAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    afterAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    let newPostID = '';
    it('Should create new post. And return status 201 [POST]', async () => {
      const createPostResponse = await request(server)
        .post('/posts')
        .send(createInputPostDto)
        .expect(201);
      newPostID = createPostResponse.body.id;
    });
    it('should return new post with response status 200 [GET]', async () => {
      const foundPost = await request(server)
        .get('/posts/' + newPostID)
        .send()
        .expect(200);
    });
  });

  describe('Posts [PUT]', () => {});

  describe('Posts [DELETE]', () => {
    beforeAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    afterAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    it('Should try delete non existing post. Return response status 404 [DELETE]', async () => {
      await request(server)
        .delete('/posts/' + 'nonExistentId')
        .expect(404);
    });
    let newPostID = '';
    it('should create new post and return status 201 [POST]', async () => {
      const createPostResponse = await request(server)
        .post('/posts')
        .send(createInputPostDto)
        .expect(201);
      newPostID = createPostResponse.body.id;
    });
    console.log(newPostID);
    it('Should delete new post. Return response status 204 [DELETE]', async () => {
      await request(server)
        .delete('/posts/' + newPostID)
        .expect(204);
    });
    it('should return a 404 status after receiving a deleted post [GET]', async () => {
      const res = await request(server)
        .get('/posts/' + newPostID)
        .send()
        .expect(404);
    });
  });

  describe('Posts [GET] Return post by ID', () => {
    beforeAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    afterAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    it('should return status 404 when try to get non existent post [GET]', async () => {
      await request(server)
        .get('/posts/' + 'nonExistentId')
        .send()
        .expect(404);
    });
    let newPostID = '';
    it('should create new post and return status 201 [POST]', async () => {
      const createPostResponse = await request(server)
        .post('/posts')
        .send(createInputPostDto)
        .expect(201);
      newPostID = createPostResponse.body.id;
    });
    it('should return new post with response status 200 [GET]', async () => {
      const foundPost = await request(server)
        .get('/posts/' + newPostID)
        .send()
        .expect(200);
      const outputPostObj: OutputPostDto = {
        id: expect.any(String),
        createdAt: expect.any(String),
        blogId: createInputPostDto.blogId,
        blogName: expect.any(String),
        content: createInputPostDto.content,
        title: createInputPostDto.title,
        shortDescription: createInputPostDto.shortDescription,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [
            {
              addedAt: expect.any(String),
              login: expect.any(String),
              userId: expect.any(String),
            },
          ],
        },
      };
      expect(foundPost.body).toStrictEqual(outputPostObj);
    });
  });
});
