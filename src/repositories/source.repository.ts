import { Injectable } from '@nestjs/common';

import { StaticJSONDBService } from '../static-json-db/static-json-db.service';
import { InstanceNotFoundException } from './exceptions/instance-not-found.exception';
import { ISourceDTO } from './interfaces/source.interface';

@Injectable()
export class SourceRepository {
  constructor(private readonly staticJSONDBService: StaticJSONDBService) { }

  public async getByIdForUser(userId: string, id: string): Promise<ISourceDTO> {
    const instances: ISourceDTO[] = await this.getByIdsForUser(userId, [id]);
    const instance: ISourceDTO | undefined = instances[0];

    if (instance === undefined) { throw new InstanceNotFoundException(); }

    return instance;
  }

  public async getByIdsForUser(userId: string, ids: string[]): Promise<ISourceDTO[]> {
    return this.getAllSourcesForUser(userId).filter((i: ISourceDTO) => ids.includes(i.id));
  }

  private getAllSourcesForUser(userId: string): ISourceDTO[] {
    return this.staticJSONDBService.getDBForUser(userId).source;
  }
}
