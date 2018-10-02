import { Test, TestingModule } from '@nestjs/testing';

import { IStaticJsonDB } from './interfaces/db.interface';
import { StaticJSONDBService } from './static-json-db.service';

describe('StaticJSONDBService', () => {
  let app: TestingModule;
  let staticJsonDbService: StaticJSONDBService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [StaticJSONDBService]
    }).compile();

    staticJsonDbService = app.get<StaticJSONDBService>(StaticJSONDBService);
  });

  describe('getDBForUser', () => {
    it('should return a db for a new user', () => {
      expect(staticJsonDbService.getDBForUser('a')).toBeDefined();
    });

    it('should return a different db (with no shared references) for a different user', () => {
      expect(staticJsonDbService.getDBForUser('a')).not.toBe(staticJsonDbService.getDBForUser('b'));
      expect(staticJsonDbService.getDBForUser('a').crime).not.toBe(staticJsonDbService.getDBForUser('b').crime);
      expect(staticJsonDbService.getDBForUser('a').region).not.toBe(staticJsonDbService.getDBForUser('b').region);
      expect(staticJsonDbService.getDBForUser('a').suspect).not.toBe(staticJsonDbService.getDBForUser('b').suspect);
    });

    it('should return same db for the same user', () => {
      expect(staticJsonDbService.getDBForUser('a')).toBe(staticJsonDbService.getDBForUser('a'));
    });

    it('should return a db seeded with some regions for a new user', () => {
      const db: IStaticJsonDB = staticJsonDbService.getDBForUser('a');
      expect(db.region.length).toBeGreaterThan(10);
    });

    it('should return a db seeded with some crimes for a new user', () => {
      const db: IStaticJsonDB = staticJsonDbService.getDBForUser('a');
      expect(db.crime.length).toBeGreaterThan(10);
    });

    it('should return a db seeded with some suspects for a new user', () => {
      const db: IStaticJsonDB = staticJsonDbService.getDBForUser('a');
      expect(db.suspect.length).toBeGreaterThan(10);
    });
  });

  describe('persistDBForUser', () => {
    it('should persist the db', () => {
      const newDB: IStaticJsonDB = { crime: [], suspect: [], region: [] };
      expect(staticJsonDbService.getDBForUser('a')).not.toEqual(newDB);

      staticJsonDbService.persistDBForUser('a', newDB);

      expect(staticJsonDbService.getDBForUser('a')).toEqual(newDB);
    });

    it('should not persist the db for another user without his db', () => {
      const newDB: IStaticJsonDB = { crime: [], suspect: [], region: [] };
      staticJsonDbService.persistDBForUser('a', newDB);

      expect(staticJsonDbService.getDBForUser('b')).not.toEqual(newDB);
    });

    it('should not persist the db for another user with his db', () => {
      staticJsonDbService.persistDBForUser('b', staticJsonDbService.getDBForUser('b'));

      const newDB: IStaticJsonDB = { crime: [], suspect: [], region: [] };
      staticJsonDbService.persistDBForUser('a', newDB);

      expect(staticJsonDbService.getDBForUser('b')).not.toEqual(newDB);
    });

  });

});
