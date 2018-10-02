import { Test, TestingModule } from '@nestjs/testing';

import { IStaticJsonDB } from '../static-json-db/interfaces/db.interface';
import { StaticJSONDBService } from '../static-json-db/static-json-db.service';
import { CrimeRepository } from './crime.repository';
import { InstanceNotFoundException } from './exceptions/instance-not-found.exception';

const mockDataFactory: () => IStaticJsonDB = (): IStaticJsonDB => {
  return {
    region: [
      { id: '1', name: 'Bemowo', pop: 120449 },
      { id: '2', name: 'Białołęka', pop: 116127 }
    ],
    crime: [
      { id: '1', priority: null, description: 'Aggravated harassment of an employee by an inmate', suspectId: '1', regionId: '1' },
      { id: '2', priority: null, description: 'Unlawful assembly', suspectId: '2', regionId: '2' }
    ],
    suspect: [
      { id: '1', name: 'Violet Bouton' },
      { id: '2', name: 'Marjory Gengler' }
    ]
  };
};

describe('CrimeRepository', () => {
  let app: TestingModule;
  let crimeRepository: CrimeRepository;
  let staticJSONDBService: StaticJSONDBService;

  beforeEach(async () => {
    staticJSONDBService = new StaticJSONDBService();
    app = await Test.createTestingModule({
      providers: [
        CrimeRepository,
        StaticJSONDBService
      ]
    }).compile();

    staticJSONDBService = app.get(StaticJSONDBService);
    crimeRepository = app.get<CrimeRepository>(CrimeRepository);
  });

  beforeEach(async () => {
    staticJSONDBService.persistDBForUser('a', mockDataFactory());
    staticJSONDBService.persistDBForUser('b', mockDataFactory());
  });

  describe('getByIdForUser', () => {
    it('should pass the right userId to StaticJSONDBService.getDBForUser', async () => {
      const getSpy: jest.SpyInstance<(userId: string) => IStaticJsonDB> = jest.spyOn(staticJSONDBService, 'getDBForUser');

      await crimeRepository.getByIdForUser('a', '1');

      getSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
    });

    it('should return by id', async () => {
      expect(await crimeRepository.getByIdForUser('a', '2')).toEqual(
        { id: '2', priority: null, description: 'Unlawful assembly', suspectId: '2', regionId: '2' }
      );
    });

    it('should throw if not found', async () => {
      await expect(crimeRepository.getByIdForUser('a', 'notfound')).rejects.toBeInstanceOf(InstanceNotFoundException);
    });
  });

  describe('getByIdsForUser', () => {
    it('should pass the right userId to StaticJSONDBService.getDBForUser', async () => {
      const getSpy: jest.SpyInstance<(userId: string) => IStaticJsonDB> = jest.spyOn(staticJSONDBService, 'getDBForUser');

      await crimeRepository.getByIdsForUser('a', ['1', '2']);

      getSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
    });

    it('should return by ids', async () => {
      expect(await crimeRepository.getByIdsForUser('a', ['1', '2'])).toEqual([
        { id: '1', priority: null, description: 'Aggravated harassment of an employee by an inmate', suspectId: '1', regionId: '1' },
        { id: '2', priority: null, description: 'Unlawful assembly', suspectId: '2', regionId: '2' }
      ]);
    });

    it('should omit those that do not exist', async () => {
      expect(await crimeRepository.getByIdsForUser('a', ['1', '2', '3'])).toEqual([
        { id: '1', priority: null, description: 'Aggravated harassment of an employee by an inmate', suspectId: '1', regionId: '1' },
        { id: '2', priority: null, description: 'Unlawful assembly', suspectId: '2', regionId: '2' }
      ]);
    });
  });

  describe('getIdsForUserForRegion', () => {
    it('should pass the right userId to StaticJSONDBService.getDBForUser', async () => {
      const getSpy: jest.SpyInstance<(userId: string) => IStaticJsonDB> = jest.spyOn(staticJSONDBService, 'getDBForUser');

      await crimeRepository.getIdsForUserForRegion('a', '1');

      getSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
    });

    it('should return right ids', async () => {
      expect(await crimeRepository.getIdsForUserForRegion('a', '2')).toEqual(['2']);
    });
  });

  describe('updateByIdForUser', () => {
    it('should pass the right userId to StaticJSONDBService.[getDBForUser, persistDBForUser] ', async () => {
      const getSpy: jest.SpyInstance<(userId: string) => IStaticJsonDB> = jest.spyOn(staticJSONDBService, 'getDBForUser');
      const persistSpy: jest.SpyInstance<(userId: string, db: IStaticJsonDB) => void> = jest.spyOn(staticJSONDBService, 'persistDBForUser');

      await crimeRepository.updateByIdForUser('a', '1', {});

      getSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
      persistSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
    });

    it('should throw if not found', async () => {
      await expect(crimeRepository.updateByIdForUser('a', 'notfound', {})).rejects.toBeInstanceOf(InstanceNotFoundException);
    });

    it('should return the updated object', async () => {
      expect(await crimeRepository.updateByIdForUser('a', '1', { priority: 1 })).toEqual(
        { id: '1', priority: 1, description: 'Aggravated harassment of an employee by an inmate', suspectId: '1', regionId: '1' }
      );
    });

    it('should persist the update', async () => {
      await crimeRepository.updateByIdForUser('a', '1', { priority: 1 });

      expect(await crimeRepository.getByIdForUser('a', '1')).toEqual(
        { id: '1', priority: 1, description: 'Aggravated harassment of an employee by an inmate', suspectId: '1', regionId: '1' }
      );
    });

    it('should update only the defined keys', async () => {
      await crimeRepository.updateByIdForUser('a', '1', { priority: undefined });

      expect(await crimeRepository.getByIdForUser('a', '1')).toEqual(
        { id: '1', priority: null, description: 'Aggravated harassment of an employee by an inmate', suspectId: '1', regionId: '1' }
      );
    });
  });

  describe('deleteByIdForUser', () => {
    it('should pass the right userId to StaticJSONDBService.[getDBForUser, persistDBForUser] ', async () => {
      const getSpy: jest.SpyInstance<(userId: string) => IStaticJsonDB> = jest.spyOn(staticJSONDBService, 'getDBForUser');
      const persistSpy: jest.SpyInstance<(userId: string, db: IStaticJsonDB) => void> = jest.spyOn(staticJSONDBService, 'persistDBForUser');

      await crimeRepository.deleteByIdForUser('a', '1');

      getSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
      persistSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
    });

    it('should delete if exists', async () => {
      await expect(crimeRepository.getByIdForUser('a', '1')).resolves.toBeDefined();

      await crimeRepository.deleteByIdForUser('a', '1');

      await expect(crimeRepository.getByIdForUser('a', '1')).rejects.toBeInstanceOf(InstanceNotFoundException);
    });

    it('should throw if not found', async () => {
      await expect(crimeRepository.deleteByIdForUser('a', 'notfound')).rejects.toBeInstanceOf(InstanceNotFoundException);
    });
  });

});
