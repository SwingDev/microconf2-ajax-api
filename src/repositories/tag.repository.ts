import { Injectable } from '@nestjs/common';

import { StaticJSONDBService } from '../static-json-db/static-json-db.service';
import { InstanceNotFoundException } from './exceptions/instance-not-found.exception';
import { ITagDTO } from './interfaces/tag.interface';

@Injectable()
export class TagRepository {
  constructor(private readonly staticJSONDBService: StaticJSONDBService) {}

  public async getByIdForUser(userId: string, id: string): Promise<ITagDTO> {
    const instances: ITagDTO[] = await this.getByIdsForUser(userId, [id]);
    const instance: ITagDTO | undefined = instances[0];

    if (instance === undefined) { throw new InstanceNotFoundException(); }

    return instance;
  }

  public async getByIdsForUser(userId: string, ids: string[]): Promise<ITagDTO[]> {
    const tags: ITagDTO[] = await this.getAllForUser(userId);

    return tags.filter((i: ITagDTO) => ids.includes(i.id));
  }

  public async getAllForUser(userId: string): Promise<ITagDTO[]> {
    return this.staticJSONDBService.getDBForUser(userId).tag;
  }
}
