import { Module } from '@nestjs/common';

import { RepositoriesModule } from '../repositories/repositories.module';
import { GifController } from './gif.controller';
import { GifService } from './gif.service';
import { SourceController } from './source.controller';
import { SourceService } from './source.service';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [
    RepositoriesModule
  ],
  controllers: [
    GifController, TagController, SourceController
  ],
  providers: [
    GifService, TagService, SourceService
  ]
})
// tslint:disable-next-line:no-unnecessary-class
export class GifsModule { }
