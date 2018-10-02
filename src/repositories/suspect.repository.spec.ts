import { Test, TestingModule } from '@nestjs/testing';

import { IStaticJsonDB } from '../static-json-db/interfaces/db.interface';
import { StaticJSONDBService } from '../static-json-db/static-json-db.service';
import { InstanceNotFoundException } from './exceptions/instance-not-found.exception';
import { SuspectRepository } from './suspect.repository';

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

describe('SuspectRepository', () => {
  let app: TestingModule;
  let suspectRepository: SuspectRepository;
  let staticJSONDBService: StaticJSONDBService;

  beforeEach(async () => {
    staticJSONDBService = new StaticJSONDBService();
    app = await Test.createTestingModule({
      providers: [
        SuspectRepository,
        StaticJSONDBService
      ]
    }).compile();

    staticJSONDBService = app.get(StaticJSONDBService);
    suspectRepository = app.get<SuspectRepository>(SuspectRepository);
  });

  beforeEach(async () => {
    staticJSONDBService.persistDBForUser('a', mockDataFactory());
    staticJSONDBService.persistDBForUser('b', mockDataFactory());
  });

  describe('getByIdForUser', () => {
    it('should pass the right userId to StaticJSONDBService.getDBForUser', async () => {
      const getSpy: jest.SpyInstance<(userId: string) => IStaticJsonDB> = jest.spyOn(staticJSONDBService, 'getDBForUser');

      await suspectRepository.getByIdForUser('a', '1');

      getSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
    });

    it('should return by id', async () => {
      expect(await suspectRepository.getByIdForUser('a', '2')).toEqual(
        { id: '2', name: 'Marjory Gengler' }
      );
    });

    it('should throw if not found', async () => {
      await expect(suspectRepository.getByIdForUser('a', 'notfound')).rejects.toBeInstanceOf(InstanceNotFoundException);
    });
  });

  describe('getByIdsForUser', () => {
    it('should pass the right userId to StaticJSONDBService.getDBForUser', async () => {
      const getSpy: jest.SpyInstance<(userId: string) => IStaticJsonDB> = jest.spyOn(staticJSONDBService, 'getDBForUser');

      await suspectRepository.getByIdsForUser('a', ['1', '2']);

      getSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
    });

    it('should return by ids', async () => {
      expect(await suspectRepository.getByIdsForUser('a', ['1', '2'])).toEqual([
        { id: '1', name: 'Violet Bouton' },
        { id: '2', name: 'Marjory Gengler' }
      ]);
    });

    it('should omit those that do not exist', async () => {
      expect(await suspectRepository.getByIdsForUser('a', ['1', '2', '3'])).toEqual([
        { id: '1', name: 'Violet Bouton' },
        { id: '2', name: 'Marjory Gengler' }
      ]);
    });
  });

});
