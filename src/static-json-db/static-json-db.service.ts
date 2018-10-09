import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { IStaticJsonDB } from './interfaces/db.interface';

@Injectable()
export class StaticJSONDBService {
  private dbsMap: { [userId: string]: IStaticJsonDB } = {};

  public getDBForUser(userId: string): IStaticJsonDB {
    let db: IStaticJsonDB | undefined = this.dbsMap[userId];

    if (db === undefined) {
      db = this.cloneDBFromSeed();
      this.persistDBForUser(userId, db);
    }

    return db;
  }

  public persistDBForUser(userId: string, db: IStaticJsonDB): void {
    this.dbsMap[userId] = db;
  }

  private cloneDBFromSeed(): IStaticJsonDB {
    const jsonPath: string = path.resolve(__dirname, '../../fixtures/seed.json');

    return <IStaticJsonDB>JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  }
}
