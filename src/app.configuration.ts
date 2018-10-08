import { INestApplication, ValidationPipe } from '@nestjs/common';
import { InstanceNotFoundExceptionFilter } from './common/filters/entity-not-found-exception.filter';

export function configureApplicaton(app: INestApplication): void {
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(
    new InstanceNotFoundExceptionFilter()
  );
}
