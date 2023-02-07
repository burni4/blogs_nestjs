import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  OutputBlogDto,
  OutputBlogsWithPaginationDto,
} from '../src/blogs/dto/output-blog.dto';
import { CreateBlogInputModelDto } from '../src/blogs/dto/create-blog.dto';
import { UpdateBlogInputModelDto } from '../src/blogs/dto/update-blog.dto';
import { connectExternalComponents } from '../src/main';

jest.setTimeout(600000);

const createInputBlogDto: CreateBlogInputModelDto = {
  name: 'TestBlog1',
  description: 'Test description for TestBlog1',
  websiteUrl: 'https://TestBlog1URL',
};
const updateInputBlogDto: UpdateBlogInputModelDto = {
  name: createInputBlogDto.name + '(UPDATE)',
  description: createInputBlogDto.description + '(UPDATE)',
  websiteUrl: createInputBlogDto.websiteUrl,
};
describe('AppController', () => {
  let app: INestApplication;
  let server: any;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app = connectExternalComponents(app);

    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    app.close();
  });

  //TODO
  describe('Test', () => {
    beforeAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    afterAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });

    const createTestInputBlogDto: CreateBlogInputModelDto = {
      name: 'TestBlog 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15',
      description: 'Test description for TestBlog1',
      websiteUrl: '123',
    };

    it('should return status 400 [POST]', async () => {
      const createBlogResponse = await request(server)
        .post('/blogs')
        .send(createTestInputBlogDto)
        .expect(400);
    });
  });

  describe('Blogs [POST]. Create new blog', () => {
    beforeAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    afterAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    let newBlogID = '';
    it('Should create new blog. And return status 201 [POST]', async () => {
      const outputBlogDto: OutputBlogDto = {
        id: expect.any(String),
        description: createInputBlogDto.description,
        websiteUrl: createInputBlogDto.websiteUrl,
        name: createInputBlogDto.name,
        isMembership: false,
        createdAt: expect.any(String),
      };
      const createPostResponse = await request(server)
        .post('/blogs')
        .send(createInputBlogDto)
        .expect(201);
      expect(createPostResponse.body).toStrictEqual(outputBlogDto);
      newBlogID = createPostResponse.body.id;
    });
    it('should return new blog with response status 200 [GET]', async () => {
      const foundPost = await request(server)
        .get('/blogs/' + newBlogID)
        .send()
        .expect(200);
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
        .send(createInputBlogDto)
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
        name: createInputBlogDto.name,
        websiteUrl: createInputBlogDto.websiteUrl,
        description: createInputBlogDto.description,
        isMembership: false,
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
        await request(server)
          .post('/blogs')
          .send(createInputBlogDto)
          .expect(201);
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
    let newBlogID = '';
    it('should return status 404 when update non existent blog [PUT]', async () => {
      await request(server)
        .get('/blogs/' + 'nonExistentId')
        .send(updateInputBlogDto)
        .expect(404);
    });
    it('should create new blog and return status 201 [POST]', async () => {
      const createBlogResponse = await request(server)
        .post('/blogs')
        .send(createInputBlogDto)
        .expect(201);
      newBlogID = createBlogResponse.body.id;
    });
    it('should return new blog with response status 200 [GET]', async () => {
      const foundBlog = await request(server)
        .get('/blogs/' + newBlogID)
        .send()
        .expect(200);
    });
    it('Update blog and return status 204 [PUT]', async () => {
      const updatedBlogResponse = await request(server)
        .put('/blogs/' + newBlogID)
        .send(updateInputBlogDto)
        .expect(204);
    });
    it('should return blog with updated data and response status 200 [GET]', async () => {
      const foundBlog = await request(server)
        .get('/blogs/' + newBlogID)
        .send()
        .expect(200);
      const outputBlogObj: OutputBlogDto = {
        id: expect.any(String),
        createdAt: expect.any(String),
        name: createInputBlogDto.name + '(UPDATE)',
        description: createInputBlogDto.description + '(UPDATE)',
        websiteUrl: createInputBlogDto.websiteUrl,
        isMembership: false,
      };
      expect(foundBlog.body).toStrictEqual(outputBlogObj);
    });
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
        .send(createInputBlogDto)
        .expect(201);
      newBlogID = createBlogResponse.body.id;
    });
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
