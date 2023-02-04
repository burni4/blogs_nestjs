import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  OutputBlogDto,
  OutputBlogsWithPaginationDto,
} from '../src/blogs/dto/output-blog.dto';
import { CreateBlogInputModelDto } from '../src/blogs/dto/create-blog.dto';

jest.setTimeout(600000);

const inputBlogDto: CreateBlogInputModelDto = {
  name: 'TestBlog1',
  description: 'Test description for TestBlog1',
  websiteUrl: 'https://TestBlog1URL',
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

  describe('Blogs [POST]. Create new blog', () => {
    beforeAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    afterAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });

    it('Should create new blog. And return status 201 [POST]', async () => {
      const outputBlogDto: OutputBlogDto = {
        id: expect.any(String),
        description: inputBlogDto.description,
        websiteUrl: inputBlogDto.websiteUrl,
        name: inputBlogDto.name,
        isMembership: true,
        createdAt: expect.any(String),
      };
      const createPostResponse = await request(server)
        .post('/blogs')
        .send(inputBlogDto)
        .expect(201);
      expect(createPostResponse.body).toStrictEqual(outputBlogDto);
    });
  });

  describe('Blogs [GET]. Take blog by ID', () => {
    beforeAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    afterAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    it('should return status 404 when GET non existent blog [GET]', async () => {
      await request(server)
        .get('/blogs/' + 'nonExistentId')
        .send()
        .expect(404);
    });
    let newBlogID = '';
    it('should create new blog and return status 201 [POST]', async () => {
      const createBlogResponse = await request(server)
        .post('/blogs')
        .send(inputBlogDto)
        .expect(201);
      newBlogID = createBlogResponse.body.id;
    });
    it('should return new blog with response status 200 [GET]', async () => {
      const foundBlog = await request(server)
        .get('/blogs/' + newBlogID)
        .send()
        .expect(200);
      const outputBlogObj: OutputBlogDto = {
        id: expect.any(String),
        createdAt: expect.any(String),
        name: inputBlogDto.name,
        websiteUrl: inputBlogDto.websiteUrl,
        description: inputBlogDto.description,
        isMembership: true,
      };
      expect(foundBlog.body).toStrictEqual(outputBlogObj);
    });
  });

  describe('Blogs [GET]. Get all blogs', () => {
    beforeAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    afterAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    it('should return status 200 when GET all blogs [GET]', async () => {
      await request(server).get('/blogs').send().expect(200);
    });
    it('should return empty array with default blogs pagination. Status 200 [GET]', async () => {
      const emptyBlogs = await request(server).get('/blogs').send().expect(200);
      const defaultOutputDTO: OutputBlogsWithPaginationDto =
        new OutputBlogsWithPaginationDto(0, 1, 10, 0, []);
      expect(emptyBlogs.body).toEqual(defaultOutputDTO);
    });
    it('Create 20 new blogs. All response statuses should be 201 [POST]', async () => {
      for (let step = 0; step < 20; step++) {
        await request(server).post('/blogs').send(inputBlogDto).expect(201);
      }
    });
    it('Should return 2 blogs on page. Status 200 [GET]', async () => {
      const blogs = await request(server)
        .get('/blogs')
        .send()
        .query({ pageNumber: 1, pageSize: 2 })
        .expect(200);
      expect(blogs.body.page).toBe(1);
      expect(blogs.body.pageSize).toBe(2);
      expect(blogs.body.pagesCount).toBe(10);
      expect(blogs.body.totalCount).toBe(20);
      expect(blogs.body.items.length).toEqual(2);
    });
  });
  describe('Blogs [PUT]', () => {
    beforeAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    afterAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    it('Update blog and return status 204', async () => {});
  });
  //
  describe('Blogs [DELETE]', () => {
    beforeAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    afterAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    it('Should try delete non existing blog. Return response status 404 [DELETE]', async () => {
      await request(server)
        .delete('/blogs/' + 'nonExistentId')
        .expect(404);
    });
    let newBlogID = '';
    it('should create new blog and return status 201 [POST]', async () => {
      const createBlogResponse = await request(server)
        .post('/blogs')
        .send(inputBlogDto)
        .expect(201);
      newBlogID = createBlogResponse.body.id;
    });
    console.log(newBlogID);
    it('Should delete new blog. Return response status 204 [DELETE]', async () => {
      await request(server)
        .delete('/blogs/' + newBlogID)
        .expect(204);
    });
    it('should return a 404 status after receiving a deleted blog [GET]', async () => {
      const res = await request(server)
        .get('/blogs/' + newBlogID)
        .send()
        .expect(404);
    });
  });
});
