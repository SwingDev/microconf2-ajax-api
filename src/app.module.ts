import { HelmetMiddleware } from '@nest-middlewares/helmet';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { CrimesModule } from './crimes/crimes.module';
import { RealLifeErrorsMiddleware } from './real-life/real-life-errors.middleware';
import { RealLifeLatencyMiddleware } from './real-life/real-life-latency.middleware';

@Module({
  imports: [CrimesModule],
  controllers: [],
  providers: []
})
// tslint:disable-next-line:no-unnecessary-class
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    HelmetMiddleware.configure({});

    consumer
      .apply(HelmetMiddleware, RealLifeLatencyMiddleware, RealLifeErrorsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
