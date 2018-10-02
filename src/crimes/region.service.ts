import { Injectable } from '@nestjs/common';

import { CrimeRepository } from '../repositories/crime.repository';
import { IRegionDTO } from '../repositories/interfaces/region.interface';
import { RegionRepository } from '../repositories/region.repository';
import { IUserRegionDTO } from './dto/user-region-with-crimes.dto';

@Injectable()
export class RegionService {
  constructor(
    private readonly crimeRepository: CrimeRepository,
    private readonly repository: RegionRepository
  ) { }

  public async findAll(userId: string): Promise<IUserRegionDTO[]> {
    const regions: IRegionDTO[] = await this.repository.getAllForUser(userId);

    return Promise.all(
      regions.map(async (i: IRegionDTO) => {
        return {
          ...i,
          crimeIds: await this.crimeRepository.getIdsForUserForRegion(userId, i.id)
        };
      })
    );
  }

  public async findOneById(userId: string, id: string): Promise<IUserRegionDTO> {
    const region: IRegionDTO = await this.repository.getByIdForUser(userId, id);

    return {
      ...region,
      crimeIds: await this.crimeRepository.getIdsForUserForRegion(userId, region.id)
    };
  }
}
