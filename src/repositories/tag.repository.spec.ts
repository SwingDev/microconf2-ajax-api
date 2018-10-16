import { Test, TestingModule } from '@nestjs/testing';

import { IStaticJsonDB } from '../static-json-db/interfaces/db.interface';
import { StaticJSONDBService } from '../static-json-db/static-json-db.service';
import { InstanceNotFoundException } from './exceptions/instance-not-found.exception';
import { TagRepository } from './tag.repository';

const mockDataFactory: () => IStaticJsonDB = (): IStaticJsonDB => {
  return {
    tag: [
      { id: '1', name: 'pugs' },
      { id: '2', name: 'cats' }
    ],
    gif: [
      {
        id: '1',
        vote: null,
        image: 'https://media1.giphy.com/media/gzKRbHzioNmzS/200w_s.gif',
        video: 'https://media1.giphy.com/media/gzKRbHzioNmzS/200w.mp4',
        sourceId: '1',
        tagId: '1'
      },
      {
        id: '2',
        vote: null,
        image: 'https://media1.giphy.com/media/f14rKleOPyTdu/200w_s.gif',
        video: 'https://media1.giphy.com/media/f14rKleOPyTdu/200w.mp4',
        sourceId: '1',
        tagId: '2'
      }
    ],
    source: [
      { id: '1', name: 'Violet Bouton', tld: 'reddit.com' },
      { id: '2', name: 'Marjory Gengler', tld: 'reddit.com' }
    ]
  };
};

describe('TagRepository', () => {
  let app: TestingModule;
  let tagRepository: TagRepository;
  let staticJSONDBService: StaticJSONDBService;

  beforeEach(async () => {
    staticJSONDBService = new StaticJSONDBService();
    app = await Test.createTestingModule({
      providers: [
        TagRepository,
        StaticJSONDBService
      ]
    }).compile();

    staticJSONDBService = app.get(StaticJSONDBService);
    tagRepository = app.get<TagRepository>(TagRepository);
  });

  beforeEach(async () => {
    staticJSONDBService.persistDBForUser('a', mockDataFactory());
    staticJSONDBService.persistDBForUser('b', mockDataFactory());
  });

  describe('getByIdForUser', () => {
    it('should pass the right userId to StaticJSONDBService.getDBForUser', async () => {
      const getSpy: jest.SpyInstance<(userId: string) => IStaticJsonDB> = jest.spyOn(staticJSONDBService, 'getDBForUser');

      await tagRepository.getByIdForUser('a', '1');

      getSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
    });

    it('should return by id', async () => {
      expect(await tagRepository.getByIdForUser('a', '2')).toEqual(
        { id: '2', name: 'cats'}
      );
    });

    it('should throw if not found', async () => {
      await expect(tagRepository.getByIdForUser('a', 'notfound')).rejects.toBeInstanceOf(InstanceNotFoundException);
    });
  });

  describe('getByIdsForUser', () => {
    it('should pass the right userId to StaticJSONDBService.getDBForUser', async () => {
      const getSpy: jest.SpyInstance<(userId: string) => IStaticJsonDB> = jest.spyOn(staticJSONDBService, 'getDBForUser');

      await tagRepository.getByIdsForUser('a', ['1', '2']);

      getSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
    });

    it('should return by ids', async () => {
      expect(await tagRepository.getByIdsForUser('a', ['1', '2'])).toEqual([
        { id: '1', name: 'pugs'},
        { id: '2', name: 'cats'}
      ]);
    });

    it('should omit those that do not exist', async () => {
      expect(await tagRepository.getByIdsForUser('a', ['1', '2', '3'])).toEqual([
        { id: '1', name: 'pugs'},
        { id: '2', name: 'cats'}
      ]);
    });
  });

  describe('getAllForUser', () => {
    it('should pass the right userId to StaticJSONDBService.getDBForUser', async () => {
      const getSpy: jest.SpyInstance<(userId: string) => IStaticJsonDB> = jest.spyOn(staticJSONDBService, 'getDBForUser');

      await tagRepository.getAllForUser('a');

      getSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
    });

    it('should return all', async () => {
      expect(await tagRepository.getAllForUser('a')).toEqual([
        { id: '1', name: 'pugs'},
        { id: '2', name: 'cats'}
      ]);
    });
  });

});
