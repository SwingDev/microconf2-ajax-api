import { Injectable } from '@nestjs/common';

import { CrimeRepository } from '../repositories/crime.repository';
import { ICrimeDTO } from '../repositories/interfaces/crime.interface';
import { PatchUserCrimeDTO } from './dto/patch-user-crime.dto';
import { IUserCrimeDTO } from './dto/user-crime.dto';

@Injectable()
export class CrimeService {
  constructor(
    private readonly repository: CrimeRepository
  ) { }

  public async findOneById(userId: string, id: string): Promise<IUserCrimeDTO> {
    const crime: ICrimeDTO = await this.repository.getByIdForUser(userId, id);

    return { ...crime };
  }

  public async findAllByIds(userId: string, ids: string[]): Promise<IUserCrimeDTO[]> {
    const crimes: ICrimeDTO[] = await this.repository.getByIdsForUser(userId, ids);

    return crimes.map((crime: ICrimeDTO) => {
      return { ...crime };
    });
  }

  public async patchById(userId: string, id: string, data: PatchUserCrimeDTO): Promise<IUserCrimeDTO> {
    const crime: ICrimeDTO = await this.repository.updateByIdForUser(userId, id, {
      priority: data.priority
    });

    return { ...crime };
  }

  public async deleteById(userId: string, id: string): Promise<void> {
    await this.repository.deleteByIdForUser(userId, id);
  }
}
