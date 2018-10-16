import { Injectable } from '@nestjs/common';

import { ISourceDTO } from '../repositories/interfaces/source.interface';
import { SourceRepository } from '../repositories/source.repository';
import { IUserSourceDTO } from './dto/user-source.dto';

@Injectable()
export class SourceService {
  constructor(
    private readonly repository: SourceRepository
  ) { }

  public async findOneById(userId: string, id: string): Promise<IUserSourceDTO> {
    const source: ISourceDTO = await this.repository.getByIdForUser(userId, id);

    return { ...source };
  }

  public async findAllByIds(userId: string, ids: string[]): Promise<IUserSourceDTO[]> {
    const sources: ISourceDTO[] = await this.repository.getByIdsForUser(userId, ids);

    return sources.map((source: ISourceDTO) => {
      return { ...source };
    });
  }
}
