// tslint:disable:no-console

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { configureApplicaton } from '../app.configuration';
import { AppModule } from '../app.module';

const port: number = process.env.PORT !== undefined ? parseInt(process.env.PORT, 10) : 3000;

async function bootstrap(): Promise<any> {
  const app: INestApplication = await NestFactory.create(AppModule);
  configureApplicaton(app);

  return app.listen(port);
}

bootstrap()
.then(() => {
  console.log(`App running on port ${port}.`);
})
.catch((err: Error) => {
  console.error(err);
  process.exit(1);
});
