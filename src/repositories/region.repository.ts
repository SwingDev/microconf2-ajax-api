import { Injectable } from '@nestjs/common';

import { StaticJSONDBService } from '../static-json-db/static-json-db.service';
import { InstanceNotFoundException } from './exceptions/instance-not-found.exception';
import { IRegionDTO } from './interfaces/region.interface';

@Injectable()
export class RegionRepository {
  constructor(private readonly staticJSONDBService: StaticJSONDBService) {}

  public async getByIdForUser(userId: string, id: string): Promise<IRegionDTO> {
    const instances: IRegionDTO[] = await this.getByIdsForUser(userId, [id]);
    const instance: IRegionDTO | undefined = instances[0];

    if (instance === undefined) { throw new InstanceNotFoundException(); }

    return instance;
  }

  public async getByIdsForUser(userId: string, ids: string[]): Promise<IRegionDTO[]> {
    const regions: IRegionDTO[] = await this.getAllForUser(userId);

    return regions.filter((i: IRegionDTO) => ids.includes(i.id));
  }

  public async getAllForUser(userId: string): Promise<IRegionDTO[]> {
    return this.staticJSONDBService.getDBForUser(userId).region;
  }
}
