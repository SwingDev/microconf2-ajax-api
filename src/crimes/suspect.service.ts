import { Injectable } from '@nestjs/common';

import { ISuspectDTO } from '../repositories/interfaces/suspect.interface';
import { SuspectRepository } from '../repositories/suspect.repository';
import { IUserSuspectDTO } from './dto/user-suspect.dto';

@Injectable()
export class SuspectService {
  constructor(
    private readonly repository: SuspectRepository
  ) { }

  public async findOneById(userId: string, id: string): Promise<IUserSuspectDTO> {
    const suspect: ISuspectDTO = await this.repository.getByIdForUser(userId, id);

    return { ...suspect };
  }

  public async findAllByIds(userId: string, ids: string[]): Promise<IUserSuspectDTO[]> {
    const suspects: ISuspectDTO[] = await this.repository.getByIdsForUser(userId, ids);

    return suspects.map((suspect: ISuspectDTO) => {
      return { ...suspect };
    });
  }
}
