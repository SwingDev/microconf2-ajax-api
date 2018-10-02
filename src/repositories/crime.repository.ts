import { Injectable } from '@nestjs/common';

import { IStaticJsonDB } from '../static-json-db/interfaces/db.interface';
import { StaticJSONDBService } from '../static-json-db/static-json-db.service';
import { InstanceNotFoundException } from './exceptions/instance-not-found.exception';
import { ICrimeDTO } from './interfaces/crime.interface';

@Injectable()
export class CrimeRepository {
  constructor(private readonly staticJSONDBService: StaticJSONDBService) { }

  public async getByIdForUser(userId: string, id: string): Promise<ICrimeDTO> {
    const instances: ICrimeDTO[] = await this.getByIdsForUser(userId, [id]);
    const instance: ICrimeDTO | undefined = instances[0];

    if (instance === undefined) { throw new InstanceNotFoundException(); }

    return instance;
  }

  public async getByIdsForUser(userId: string, ids: string[]): Promise<ICrimeDTO[]> {
    return this.getAllCrimesForUser(userId).filter((i: ICrimeDTO) => ids.includes(i.id));
  }

  public async getIdsForUserForRegion(userId: string, regionId: string): Promise<string[]> {
    return this.getAllCrimesForUser(userId)
      .filter((i: ICrimeDTO) => i.regionId === regionId)
      .map((i: ICrimeDTO) => i.id);
  }

  public async updateByIdForUser(userId: string, id: string, data: Partial<ICrimeDTO>): Promise<ICrimeDTO> {
    const crime: ICrimeDTO = await this.getByIdForUser(userId, id);
    const newCrime: ICrimeDTO = {
      ...crime,
      priority: data.priority !== undefined ? data.priority : crime.priority
    };

    const db: IStaticJsonDB = this.staticJSONDBService.getDBForUser(userId);
    db.crime = db.crime.map((i: ICrimeDTO) => i.id === id ? newCrime : i);

    this.staticJSONDBService.persistDBForUser(userId, db);

    return newCrime;
  }

  public async deleteByIdForUser(userId: string, id: string): Promise<void> {
    const db: IStaticJsonDB = this.staticJSONDBService.getDBForUser(userId);
    const oldLength: number = db.crime.length;

    db.crime = db.crime.filter((i: ICrimeDTO) => i.id !== id);

    if (oldLength === db.crime.length) { throw new InstanceNotFoundException(); }

    this.staticJSONDBService.persistDBForUser(userId, db);
  }

  private getAllCrimesForUser(userId: string): ICrimeDTO[] {
    return this.staticJSONDBService.getDBForUser(userId).crime;
  }
}
