import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ICurrentUserDTO } from '../auth/interfaces/current-user.interface';
import { PatchUserGifDTO } from './dto/patch-user-gif.dto';
import { QueryUserGifDTO } from './dto/query-user-gif.dto';
import { IUserGifDTO } from './dto/user-gif.dto';
import { GifService } from './gif.service';

@Controller('gif')
export class GifController {
  constructor(
    private readonly service: GifService
  ) { }

  @Get('/')
  public async findAll(@CurrentUser() user: ICurrentUserDTO, @Query() query: QueryUserGifDTO): Promise<IUserGifDTO[]> {
    return this.service.findAllByIds(user.id, query.ids);
  }

  @Get('/:id')
  public async findOne(@CurrentUser() user: ICurrentUserDTO, @Param('id') id: string): Promise<IUserGifDTO> {
    return this.service.findOneById(user.id, id);
  }

  @Patch('/:id')
  public async updateOne(
    @CurrentUser() user: ICurrentUserDTO, @Param('id') id: string, @Body() data: PatchUserGifDTO
  ): Promise<IUserGifDTO> {
    return this.service.patchById(user.id, id, data);
  }

  @Delete('/:id')
  public async deleteOne(@CurrentUser() user: ICurrentUserDTO, @Param('id') id: string): Promise<void> {
    return this.service.deleteById(user.id, id);
  }
}
