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

  it('/region (GET)', (done: any) => {
    return request(app.getHttpServer())
      .get('/region')
      .expect(200)
      .end(done);
  });

  it('/region/676a82c2-6310-4aec-bc45-32473979faf5 (GET)', (done: any) => {
    return request(app.getHttpServer())
      .get('/region/676a82c2-6310-4aec-bc45-32473979faf5')
      .expect(200)
      .end(done);
  });

  it('/region/blabla (GET 404)', (done: any) => {
    return request(app.getHttpServer())
      .get('/region/blabla')
      .expect(404)
      .end(done);
  });

  it('/suspect/1404f415-ac46-47e0-92bf-4b68a71cb760 (GET)', (done: any) => {
    return request(app.getHttpServer())
      .get('/suspect/1404f415-ac46-47e0-92bf-4b68a71cb760')
      .expect(200)
      .end(done);
  });

  it('/suspect?ids=1404f415-ac46-47e0-92bf-4b68a71cb760&ids=3047ef8e-ca2c-4391-9f3d-04e7eb9a3191 (GET)', (done: any) => {
    return request(app.getHttpServer())
      .get('/suspect')
      .query({
        ids: ['1404f415-ac46-47e0-92bf-4b68a71cb760', '3047ef8e-ca2c-4391-9f3d-04e7eb9a3191']
      })
      .expect(200)
      .end(done);
  });

  it('/suspect/blabla (GET 404)', (done: any) => {
    return request(app.getHttpServer())
      .get('/suspect/blabla')
      .expect(404)
      .end(done);
  });

  it('/crime/bd7a95fe-725e-40ca-846b-e06ca7a5002d (GET)', (done: any) => {
    return request(app.getHttpServer())
      .get('/crime/bd7a95fe-725e-40ca-846b-e06ca7a5002d')
      .expect(200)
      .expect('{"id":"bd7a95fe-725e-40ca-846b-e06ca7a5002d","priority":null,"description":"Receiving reward for official misconduct in the second degree","suspectId":"ff84d76c-d1bf-48b6-a820-20f524046324","regionId":"d23ce64a-b2d3-4094-8155-2429d5ae7c8e"}')
      .end(done);
  });

  it('/crime?ids=bd7a95fe-725e-40ca-846b-e06ca7a5002d&ids=95bce6da-414b-4dd0-96e6-cdbf9ea90943 (GET)', (done: any) => {
    return request(app.getHttpServer())
      .get('/crime')
      .query({
        ids: ['bd7a95fe-725e-40ca-846b-e06ca7a5002d', '95bce6da-414b-4dd0-96e6-cdbf9ea90943']
      })
      .expect(200)
      .end(done);
  });

  it('/crime/blabla (GET 404)', (done: any) => {
    return request(app.getHttpServer())
      .get('/crime/blabla')
      .expect(404)
      .end(done);
  });

  it('/crime/bd7a95fe-725e-40ca-846b-e06ca7a5002d (PATCH)', (done: any) => {
    return request(app.getHttpServer())
      .patch('/crime/bd7a95fe-725e-40ca-846b-e06ca7a5002d')
      .send({
        priority: 3
      })
      .expect(200)
      .expect('{"id":"bd7a95fe-725e-40ca-846b-e06ca7a5002d","priority":3,"description":"Receiving reward for official misconduct in the second degree","suspectId":"ff84d76c-d1bf-48b6-a820-20f524046324","regionId":"d23ce64a-b2d3-4094-8155-2429d5ae7c8e"}')
      .end(done);
  });

  it('/crime/bd7a95fe-725e-40ca-846b-e06ca7a5002d (PATCH 400)', (done: any) => {
    return request(app.getHttpServer())
      .patch('/crime/bd7a95fe-725e-40ca-846b-e06ca7a5002d')
      .send({
        priority: '10'
      })
      .expect(400)
      .end(done);
  });

  it('/crime/bd7a95fe-725e-40ca-846b-e06ca7a5002d (DELETE)', (done: any) => {
    return request(app.getHttpServer())
      .delete('/crime/bd7a95fe-725e-40ca-846b-e06ca7a5002d')
      .expect(200)
      .end(done);
  });

  it('/crime/bd7a95fe-725e-40ca-846b-e06ca7a5002d (DELETE REPEATEDLY 404)', (done: any) => {
    return request(app.getHttpServer())
      .delete('/crime/bd7a95fe-725e-40ca-846b-e06ca7a5002d')
      .expect(404)
      .end(done);
  });
});
