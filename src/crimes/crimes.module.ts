import { Module } from '@nestjs/common';

import { RepositoriesModule } from '../repositories/repositories.module';
import { CrimeController } from './crime.controller';
import { CrimeService } from './crime.service';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';
import { SuspectController } from './suspect.controller';
import { SuspectService } from './suspect.service';

@Module({
  imports: [
    RepositoriesModule
  ],
  controllers: [
    CrimeController, RegionController, SuspectController
  ],
  providers: [
    CrimeService, RegionService, SuspectService
  ]
})
// tslint:disable-next-line:no-unnecessary-class
export class CrimesModule { }
