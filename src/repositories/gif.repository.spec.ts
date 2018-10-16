import { Test, TestingModule } from '@nestjs/testing';

import { IStaticJsonDB } from '../static-json-db/interfaces/db.interface';
import { StaticJSONDBService } from '../static-json-db/static-json-db.service';
import { InstanceNotFoundException } from './exceptions/instance-not-found.exception';
import { GifRepository } from './gif.repository';

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

describe('GifRepository', () => {
  let app: TestingModule;
  let gifRepository: GifRepository;
  let staticJSONDBService: StaticJSONDBService;

  beforeEach(async () => {
    staticJSONDBService = new StaticJSONDBService();
    app = await Test.createTestingModule({
      providers: [
        GifRepository,
        StaticJSONDBService
      ]
    }).compile();

    staticJSONDBService = app.get(StaticJSONDBService);
    gifRepository = app.get<GifRepository>(GifRepository);
  });

  beforeEach(async () => {
    staticJSONDBService.persistDBForUser('a', mockDataFactory());
    staticJSONDBService.persistDBForUser('b', mockDataFactory());
  });

  describe('getByIdForUser', () => {
    it('should pass the right userId to StaticJSONDBService.getDBForUser', async () => {
      const getSpy: jest.SpyInstance<(userId: string) => IStaticJsonDB> = jest.spyOn(staticJSONDBService, 'getDBForUser');

      await gifRepository.getByIdForUser('a', '1');

      getSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
    });

    it('should return by id', async () => {
      expect(await gifRepository.getByIdForUser('a', '2')).toEqual(
        {
          id: '2',
          vote: null,
          image: 'https://media1.giphy.com/media/f14rKleOPyTdu/200w_s.gif',
          video: 'https://media1.giphy.com/media/f14rKleOPyTdu/200w.mp4',
          sourceId: '1',
          tagId: '2'
        }
      );
    });

    it('should throw if not found', async () => {
      await expect(gifRepository.getByIdForUser('a', 'notfound')).rejects.toBeInstanceOf(InstanceNotFoundException);
    });
  });

  describe('getByIdsForUser', () => {
    it('should pass the right userId to StaticJSONDBService.getDBForUser', async () => {
      const getSpy: jest.SpyInstance<(userId: string) => IStaticJsonDB> = jest.spyOn(staticJSONDBService, 'getDBForUser');

      await gifRepository.getByIdsForUser('a', ['1', '2']);

      getSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
    });

    it('should return by ids', async () => {
      expect(await gifRepository.getByIdsForUser('a', ['1', '2'])).toEqual([
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
      ]);
    });

    it('should omit those that do not exist', async () => {
      expect(await gifRepository.getByIdsForUser('a', ['1', '2', '3'])).toEqual([
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
      ]);
    });
  });

  describe('getIdsForUserForTag', () => {
    it('should pass the right userId to StaticJSONDBService.getDBForUser', async () => {
      const getSpy: jest.SpyInstance<(userId: string) => IStaticJsonDB> = jest.spyOn(staticJSONDBService, 'getDBForUser');

      await gifRepository.getIdsForUserForTag('a', '1');

      getSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
    });

    it('should return right ids', async () => {
      expect(await gifRepository.getIdsForUserForTag('a', '2')).toEqual(['2']);
    });
  });

  describe('updateByIdForUser', () => {
    it('should pass the right userId to StaticJSONDBService.[getDBForUser, persistDBForUser] ', async () => {
      const getSpy: jest.SpyInstance<(userId: string) => IStaticJsonDB> = jest.spyOn(staticJSONDBService, 'getDBForUser');
      const persistSpy: jest.SpyInstance<(userId: string, db: IStaticJsonDB) => void> = jest.spyOn(staticJSONDBService, 'persistDBForUser');

      await gifRepository.updateByIdForUser('a', '1', {});

      getSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
      persistSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
    });

    it('should throw if not found', async () => {
      await expect(gifRepository.updateByIdForUser('a', 'notfound', {})).rejects.toBeInstanceOf(InstanceNotFoundException);
    });

    it('should return the updated object', async () => {
      expect(await gifRepository.updateByIdForUser('a', '1', { vote: 1 })).toEqual(
        {
          id: '1',
          vote: 1,
          image: 'https://media1.giphy.com/media/gzKRbHzioNmzS/200w_s.gif',
          video: 'https://media1.giphy.com/media/gzKRbHzioNmzS/200w.mp4',
          sourceId: '1',
          tagId: '1'
        }
      );
    });

    it('should persist the update', async () => {
      await gifRepository.updateByIdForUser('a', '1', { vote: 1 });

      expect(await gifRepository.getByIdForUser('a', '1')).toEqual(
        {
          id: '1',
          vote: 1,
          image: 'https://media1.giphy.com/media/gzKRbHzioNmzS/200w_s.gif',
          video: 'https://media1.giphy.com/media/gzKRbHzioNmzS/200w.mp4',
          sourceId: '1',
          tagId: '1'
        }
      );
    });

    it('should update only the defined keys', async () => {
      await gifRepository.updateByIdForUser('a', '1', { vote: undefined });

      expect(await gifRepository.getByIdForUser('a', '1')).toEqual(
        {
          id: '1',
          vote: null,
          image: 'https://media1.giphy.com/media/gzKRbHzioNmzS/200w_s.gif',
          video: 'https://media1.giphy.com/media/gzKRbHzioNmzS/200w.mp4',
          sourceId: '1',
          tagId: '1'
        }
      );
    });
  });

  describe('deleteByIdForUser', () => {
    it('should pass the right userId to StaticJSONDBService.[getDBForUser, persistDBForUser] ', async () => {
      const getSpy: jest.SpyInstance<(userId: string) => IStaticJsonDB> = jest.spyOn(staticJSONDBService, 'getDBForUser');
      const persistSpy: jest.SpyInstance<(userId: string, db: IStaticJsonDB) => void> = jest.spyOn(staticJSONDBService, 'persistDBForUser');

      await gifRepository.deleteByIdForUser('a', '1');

      getSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
      persistSpy.mock.calls.forEach((args: any[][]) => {
        expect(args[0]).toBe('a');
      });
    });

    it('should delete if exists', async () => {
      await expect(gifRepository.getByIdForUser('a', '1')).resolves.toBeDefined();

      await gifRepository.deleteByIdForUser('a', '1');

      await expect(gifRepository.getByIdForUser('a', '1')).rejects.toBeInstanceOf(InstanceNotFoundException);
    });

    it('should throw if not found', async () => {
      await expect(gifRepository.deleteByIdForUser('a', 'notfound')).rejects.toBeInstanceOf(InstanceNotFoundException);
    });
  });

});
