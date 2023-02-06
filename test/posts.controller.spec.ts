import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreatePostInputModelDto } from '../src/posts/dto/create-post.dto';
import {
  OutputPostDto,
  OutputPostsWithPaginationDto,
} from '../src/posts/dto/output-post.dto';
import { OutputBlogsWithPaginationDto } from '../src/blogs/dto/output-blog.dto';

jest.setTimeout(600000);

const createInputPostDto: CreatePostInputModelDto = {
  title: 'PostTitleTest1',
  shortDescription: 'PostShortDescriptionTest1',
  content: 'PostContentTest1',
  blogId: '',
};
const updateInputPostDto: CreatePostInputModelDto = {
  title: createInputPostDto.title + '(UPDATE)',
  shortDescription: createInputPostDto.shortDescription + '(UPDATE)',
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

  describe('Posts [PUT]', () => {
    beforeAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    afterAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    let newPostID = '';
    it('should return status 404 when update non existent post [PUT]', async () => {
      await request(server)
        .get('/posts/' + 'nonExistentId')
        .send(updateInputPostDto)
        .expect(404);
    });
    it('should create new post and return status 201 [POST]', async () => {
      const createPostResponse = await request(server)
        .post('/posts')
        .send(createInputPostDto)
        .expect(201);
      newPostID = createPostResponse.body.id;
    });
    it('should return new post with response status 200 [GET]', async () => {
      const foundBlog = await request(server)
        .get('/posts/' + newPostID)
        .send()
        .expect(200);
    });
    it('Update blog and return status 204 [PUT]', async () => {
      const updatedPostResponse = await request(server)
        .put('/posts/' + newPostID)
        .send(updateInputPostDto)
        .expect(204);
    });
    it('should return post with updated data and response status 200 [GET]', async () => {
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
        title: updateInputPostDto.title,
        shortDescription: updateInputPostDto.shortDescription,
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

  describe('Posts [GET]. Get all posts', () => {
    beforeAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    afterAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    it('should return status 200 when GET all posts [GET]', async () => {
      await request(server).get('/posts').send().expect(200);
    });
    it('should return empty array with default posts pagination. Status 200 [GET]', async () => {
      const emptyPosts = await request(server).get('/posts').send().expect(200);
      const defaultOutputDTO: OutputPostsWithPaginationDto =
        new OutputPostsWithPaginationDto(0, 1, 10, 0, []);
      expect(emptyPosts.body).toEqual(defaultOutputDTO);
    });
    it('Create 20 new posts. All response statuses should be 201 [POST]', async () => {
      for (let step = 0; step < 20; step++) {
        await request(server)
          .post('/posts')
          .send(createInputPostDto)
          .expect(201);
      }
    });
    it('Should return 2 posts on page. Status 200 [GET]', async () => {
      const posts = await request(server)
        .get('/posts')
        .send()
        .query({ pageNumber: 1, pageSize: 2 })
        .expect(200);
      expect(posts.body.page).toBe(1);
      expect(posts.body.pageSize).toBe(2);
      expect(posts.body.pagesCount).toBe(10);
      expect(posts.body.totalCount).toBe(20);
      expect(posts.body.items.length).toEqual(2);
    });
  });
});
