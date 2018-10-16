import { Injectable } from '@nestjs/common';

import { GifRepository } from '../repositories/gif.repository';
import { ITagDTO } from '../repositories/interfaces/tag.interface';
import { TagRepository } from '../repositories/tag.repository';
import { IUserTagDTO } from './dto/user-tag-with-gifs.dto';

@Injectable()
export class TagService {
  constructor(
    private readonly gifRepository: GifRepository,
    private readonly repository: TagRepository
  ) { }

  public async findAll(userId: string): Promise<IUserTagDTO[]> {
    const tags: ITagDTO[] = await this.repository.getAllForUser(userId);

    return Promise.all(
      tags.map(async (i: ITagDTO) => {
        return {
          ...i,
          gifIds: await this.gifRepository.getIdsForUserForTag(userId, i.id)
        };
      })
    );
  }

  public async findOneById(userId: string, id: string): Promise<IUserTagDTO> {
    const tag: ITagDTO = await this.repository.getByIdForUser(userId, id);

    return {
      ...tag,
      gifIds: await this.gifRepository.getIdsForUserForTag(userId, tag.id)
    };
  }
}
