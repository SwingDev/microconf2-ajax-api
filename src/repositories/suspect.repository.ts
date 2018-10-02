import { Injectable } from '@nestjs/common';

import { StaticJSONDBService } from '../static-json-db/static-json-db.service';
import { InstanceNotFoundException } from './exceptions/instance-not-found.exception';
import { ISuspectDTO } from './interfaces/suspect.interface';

@Injectable()
export class SuspectRepository {
  constructor(private readonly staticJSONDBService: StaticJSONDBService) { }

  public async getByIdForUser(userId: string, id: string): Promise<ISuspectDTO> {
    const instances: ISuspectDTO[] = await this.getByIdsForUser(userId, [id]);
    const instance: ISuspectDTO | undefined = instances[0];

    if (instance === undefined) { throw new InstanceNotFoundException(); }

    return instance;
  }

  public async getByIdsForUser(userId: string, ids: string[]): Promise<ISuspectDTO[]> {
    return this.getAllSuspectsForUser(userId).filter((i: ISuspectDTO) => ids.includes(i.id));
  }

  private getAllSuspectsForUser(userId: string): ISuspectDTO[] {
    return this.staticJSONDBService.getDBForUser(userId).suspect;
  }
}
