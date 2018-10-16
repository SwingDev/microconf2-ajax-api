import { Injectable } from '@nestjs/common';

import { GifRepository } from '../repositories/gif.repository';
import { IGifDTO } from '../repositories/interfaces/gif.interface';
import { PatchUserGifDTO } from './dto/patch-user-gif.dto';
import { IUserGifDTO } from './dto/user-gif.dto';

@Injectable()
export class GifService {
  constructor(
    private readonly repository: GifRepository
  ) { }

  public async findOneById(userId: string, id: string): Promise<IUserGifDTO> {
    const gif: IGifDTO = await this.repository.getByIdForUser(userId, id);

    return { ...gif };
  }

  public async findAllByIds(userId: string, ids: string[]): Promise<IUserGifDTO[]> {
    const gifs: IGifDTO[] = await this.repository.getByIdsForUser(userId, ids);

    return gifs.map((gif: IGifDTO) => {
      return { ...gif };
    });
  }

  public async patchById(userId: string, id: string, data: PatchUserGifDTO): Promise<IUserGifDTO> {
    const gif: IGifDTO = await this.repository.updateByIdForUser(userId, id, {
      vote: data.vote
    });

    return { ...gif };
  }

  public async deleteById(userId: string, id: string): Promise<void> {
    await this.repository.deleteByIdForUser(userId, id);
  }
}
