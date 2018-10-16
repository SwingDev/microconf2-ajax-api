import { Injectable } from '@nestjs/common';

import { IStaticJsonDB } from '../static-json-db/interfaces/db.interface';
import { StaticJSONDBService } from '../static-json-db/static-json-db.service';
import { InstanceNotFoundException } from './exceptions/instance-not-found.exception';
import { IGifDTO } from './interfaces/gif.interface';

@Injectable()
export class GifRepository {
  constructor(private readonly staticJSONDBService: StaticJSONDBService) { }

  public async getByIdForUser(userId: string, id: string): Promise<IGifDTO> {
    const instances: IGifDTO[] = await this.getByIdsForUser(userId, [id]);
    const instance: IGifDTO | undefined = instances[0];

    if (instance === undefined) { throw new InstanceNotFoundException(); }

    return instance;
  }

  public async getByIdsForUser(userId: string, ids: string[]): Promise<IGifDTO[]> {
    return this.getAllGifsForUser(userId).filter((i: IGifDTO) => ids.includes(i.id));
  }

  public async getIdsForUserForTag(userId: string, tagId: string): Promise<string[]> {
    return this.getAllGifsForUser(userId)
      .filter((i: IGifDTO) => i.tagId === tagId)
      .map((i: IGifDTO) => i.id);
  }

  public async updateByIdForUser(userId: string, id: string, data: Partial<IGifDTO>): Promise<IGifDTO> {
    const gif: IGifDTO = await this.getByIdForUser(userId, id);
    const newGif: IGifDTO = {
      ...gif,
      vote: data.vote !== undefined ? data.vote : gif.vote
    };

    const db: IStaticJsonDB = this.staticJSONDBService.getDBForUser(userId);
    db.gif = db.gif.map((i: IGifDTO) => i.id === id ? newGif : i);

    this.staticJSONDBService.persistDBForUser(userId, db);

    return newGif;
  }

  public async deleteByIdForUser(userId: string, id: string): Promise<void> {
    const db: IStaticJsonDB = this.staticJSONDBService.getDBForUser(userId);
    const oldLength: number = db.gif.length;

    db.gif = db.gif.filter((i: IGifDTO) => i.id !== id);

    if (oldLength === db.gif.length) { throw new InstanceNotFoundException(); }

    this.staticJSONDBService.persistDBForUser(userId, db);
  }

  private getAllGifsForUser(userId: string): IGifDTO[] {
    return this.staticJSONDBService.getDBForUser(userId).gif;
  }
}
