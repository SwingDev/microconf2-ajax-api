import { Module } from '@nestjs/common';

import { StaticJSONDBModule } from '../static-json-db/static-json-db.module';
import { GifRepository } from './gif.repository';
import { SourceRepository } from './source.repository';
import { TagRepository } from './tag.repository';

@Module({
  imports: [StaticJSONDBModule],
  controllers: [],
  providers: [GifRepository, TagRepository, SourceRepository],
  exports: [GifRepository, TagRepository, SourceRepository]
})
// tslint:disable-next-line:no-unnecessary-class
export class RepositoriesModule { }
