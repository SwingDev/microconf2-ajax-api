import { Test, TestingModule } from '@nestjs/testing';

import { IStaticJsonDB } from '../static-json-db/interfaces/db.interface';
import { StaticJSONDBService } from '../static-json-db/static-json-db.service';
import { InstanceNotFoundException } from './exceptions/instance-not-found.exception';
import { RegionRepository } from './region.repository';

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

describe('RegionRepository', () => {
  let app: TestingModule;
  let regionRepository: RegionRepository;
  let staticJSONDBService: StaticJSONDBService;

  beforeEach(async () => {
    staticJSONDBService = new StaticJSONDBService();
    app = await Test.createTestingModule({
      providers: [
        RegionRepository,
        StaticJSONDBService
      ]
    }).compile();

    staticJSONDBService = app.get(StaticJSONDBService);
    regionRepository = app.get<RegionRepository>(RegionRepository);
  });

  beforeEach(async () => {
    staticJSONDBService.persistDBForUser('a', mockDataFactory());
    staticJSONDBService.persistDBForUser('b', mockDataFactory());
  });

  describe('getByIdForUser', () => {
    it('should pass the right userId to StaticJSONDBService.getDBForUser', async () => {
      const getSpy: jest.SpyInstance<(userId: string) => IStaticJsonDB> = jest.spyOn(staticJSONDBService, 'getDBForUser');

      await regionRepository.getByIdForUser('a', '1');

      getSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
    });

    it('should return by id', async () => {
      expect(await regionRepository.getByIdForUser('a', '2')).toEqual(
        { id: '2', name: 'Białołęka', pop: 116127 }
      );
    });

    it('should throw if not found', async () => {
      await expect(regionRepository.getByIdForUser('a', 'notfound')).rejects.toBeInstanceOf(InstanceNotFoundException);
    });
  });

  describe('getByIdsForUser', () => {
    it('should pass the right userId to StaticJSONDBService.getDBForUser', async () => {
      const getSpy: jest.SpyInstance<(userId: string) => IStaticJsonDB> = jest.spyOn(staticJSONDBService, 'getDBForUser');

      await regionRepository.getByIdsForUser('a', ['1', '2']);

      getSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
    });

    it('should return by ids', async () => {
      expect(await regionRepository.getByIdsForUser('a', ['1', '2'])).toEqual([
        { id: '1', name: 'Bemowo', pop: 120449 },
        { id: '2', name: 'Białołęka', pop: 116127 }
      ]);
    });

    it('should omit those that do not exist', async () => {
      expect(await regionRepository.getByIdsForUser('a', ['1', '2', '3'])).toEqual([
        { id: '1', name: 'Bemowo', pop: 120449 },
        { id: '2', name: 'Białołęka', pop: 116127 }
      ]);
    });
  });

  describe('getAllForUser', () => {
    it('should pass the right userId to StaticJSONDBService.getDBForUser', async () => {
      const getSpy: jest.SpyInstance<(userId: string) => IStaticJsonDB> = jest.spyOn(staticJSONDBService, 'getDBForUser');

      await regionRepository.getAllForUser('a');

      getSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
    });

    it('should return all', async () => {
      expect(await regionRepository.getAllForUser('a')).toEqual([
        { id: '1', name: 'Bemowo', pop: 120449 },
        { id: '2', name: 'Białołęka', pop: 116127 }
      ]);
    });
  });

});
