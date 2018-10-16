// tslint:disable:max-line-length

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { configureApplicaton } from '../app.configuration';
import { AppModule } from '../app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApplicaton(app);

    await app.init();
  });

  it('/tag (GET)', (done: jest.DoneCallback) => {
    return request(app.getHttpServer())
      .get('/tag')
      .expect(200)
      .end(done);
  });

  it('/tag/4e06bc60-511f-4929-af1b-7c2cc0983de3 (GET)', (done: jest.DoneCallback) => {
    return request(app.getHttpServer())
      .get('/tag/4e06bc60-511f-4929-af1b-7c2cc0983de3')
      .expect(200)
      .end(done);
  });

  it('/tag/blabla (GET 404)', (done: jest.DoneCallback) => {
    return request(app.getHttpServer())
      .get('/tag/blabla')
      .expect(404)
      .end(done);
  });

  it('/source/91ed6c35-8df6-48d2-aee0-c8631ffd3eb9 (GET)', (done: jest.DoneCallback) => {
    return request(app.getHttpServer())
      .get('/source/91ed6c35-8df6-48d2-aee0-c8631ffd3eb9')
      .expect(200)
      .end(done);
  });

  it('/source?ids=91ed6c35-8df6-48d2-aee0-c8631ffd3eb9&ids=28873988-d669-4fd2-aa28-fdf3820e447d (GET)', (done: jest.DoneCallback) => {
    return request(app.getHttpServer())
      .get('/source')
      .query({
        ids: ['91ed6c35-8df6-48d2-aee0-c8631ffd3eb9', '28873988-d669-4fd2-aa28-fdf3820e447d']
      })
      .expect(200)
      .end(done);
  });

  it('/source/blabla (GET 404)', (done: jest.DoneCallback) => {
    return request(app.getHttpServer())
      .get('/source/blabla')
      .expect(404)
      .end(done);
  });

  it('/gif/5b694fbe-4ea7-43f7-8eef-5544b1694797 (GET)', (done: jest.DoneCallback) => {
    return request(app.getHttpServer())
      .get('/gif/5b694fbe-4ea7-43f7-8eef-5544b1694797')
      .expect(200)
      .expect('{"vote":null,"image":"https://media1.giphy.com/media/gzKRbHzioNmzS/200w_s.gif","video":"https://media1.giphy.com/media/gzKRbHzioNmzS/200w.mp4","id":"5b694fbe-4ea7-43f7-8eef-5544b1694797","sourceId":"559304ae-c14e-4302-b097-c85058d48e12","tagId":"4e06bc60-511f-4929-af1b-7c2cc0983de3"}')
      .end(done);
  });

  it('/gif?ids=5b694fbe-4ea7-43f7-8eef-5544b1694797&ids=f0f6a897-972b-44c8-9c46-1d24df345576 (GET)', (done: jest.DoneCallback) => {
    return request(app.getHttpServer())
      .get('/gif')
      .query({
        ids: ['5b694fbe-4ea7-43f7-8eef-5544b1694797', 'f0f6a897-972b-44c8-9c46-1d24df345576']
      })
      .expect(200)
      .end(done);
  });

  it('/gif/blabla (GET 404)', (done: jest.DoneCallback) => {
    return request(app.getHttpServer())
      .get('/gif/blabla')
      .expect(404)
      .end(done);
  });

  it('/gif/5b694fbe-4ea7-43f7-8eef-5544b1694797 (PATCH)', (done: jest.DoneCallback) => {
    return request(app.getHttpServer())
      .patch('/gif/5b694fbe-4ea7-43f7-8eef-5544b1694797')
      .send({
        vote: 3
      })
      .expect(200)
      .expect('{"vote":3,"image":"https://media1.giphy.com/media/gzKRbHzioNmzS/200w_s.gif","video":"https://media1.giphy.com/media/gzKRbHzioNmzS/200w.mp4","id":"5b694fbe-4ea7-43f7-8eef-5544b1694797","sourceId":"559304ae-c14e-4302-b097-c85058d48e12","tagId":"4e06bc60-511f-4929-af1b-7c2cc0983de3"}')
      .end(done);
  });

  it('/gif/5b694fbe-4ea7-43f7-8eef-5544b1694797 (PATCH 400)', (done: jest.DoneCallback) => {
    return request(app.getHttpServer())
      .patch('/gif/5b694fbe-4ea7-43f7-8eef-5544b1694797')
      .send({
        vote: '10'
      })
      .expect(400)
      .end(done);
  });

  it('/gif/5b694fbe-4ea7-43f7-8eef-5544b1694797 (DELETE)', (done: jest.DoneCallback) => {
    return request(app.getHttpServer())
      .delete('/gif/5b694fbe-4ea7-43f7-8eef-5544b1694797')
      .expect(200)
      .end(done);
  });

  it('/gif/5b694fbe-4ea7-43f7-8eef-5544b1694797 (DELETE REPEATEDLY 404)', (done: jest.DoneCallback) => {
    return request(app.getHttpServer())
      .delete('/gif/5b694fbe-4ea7-43f7-8eef-5544b1694797')
      .expect(404)
      .end(done);
  });
});
