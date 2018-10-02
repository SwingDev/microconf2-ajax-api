import { Module } from '@nestjs/common';
import { CrimesModule } from './crimes/crimes.module';

@Module({
  imports: [CrimesModule],
  controllers: [],
  providers: []
})
// tslint:disable-next-line:no-unnecessary-class
export class AppModule {}
