import { Module } from '@nestjs/common';

import { StaticJSONDBService } from './static-json-db.service';

@Module({
  imports: [],
  controllers: [],
  providers: [StaticJSONDBService],
  exports: [StaticJSONDBService]
})
// tslint:disable-next-line:no-unnecessary-class
export class StaticJSONDBModule { }
