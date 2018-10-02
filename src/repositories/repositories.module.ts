import { Module } from '@nestjs/common';

import { StaticJSONDBModule } from '../static-json-db/static-json-db.module';
import { CrimeRepository } from './crime.repository';
import { RegionRepository } from './region.repository';
import { SuspectRepository } from './suspect.repository';

@Module({
  imports: [StaticJSONDBModule],
  controllers: [],
  providers: [CrimeRepository, RegionRepository, SuspectRepository],
  exports: [CrimeRepository, RegionRepository, SuspectRepository]
})
// tslint:disable-next-line:no-unnecessary-class
export class RepositoriesModule { }
