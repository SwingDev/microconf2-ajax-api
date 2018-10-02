import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ICurrentUserDTO } from '../auth/interfaces/current-user.interface';
import { CrimeService } from './crime.service';
import { PatchUserCrimeDTO } from './dto/patch-user-crime.dto';
import { QueryUserCrimeDTO } from './dto/query-user-crime.dto';
import { IUserCrimeDTO } from './dto/user-crime.dto';

@Controller('crime')
export class CrimeController {
  constructor(
    private readonly service: CrimeService
  ) { }

  @Get('/')
  public async findAll(@CurrentUser() user: ICurrentUserDTO, @Query() query: QueryUserCrimeDTO): Promise<IUserCrimeDTO[]> {
    return this.service.findAllByIds(user.id, query.ids);
  }

  @Get('/:id')
  public async findOne(@CurrentUser() user: ICurrentUserDTO, @Param('id') id: string): Promise<IUserCrimeDTO> {
    return this.service.findOneById(user.id, id);
  }

  @Patch('/:id')
  public async updateOne(
    @CurrentUser() user: ICurrentUserDTO, @Param('id') id: string, @Body() data: PatchUserCrimeDTO
  ): Promise<IUserCrimeDTO> {
    return this.service.patchById(user.id, id, data);
  }

  @Delete('/:id')
  public async deleteOne(@CurrentUser() user: ICurrentUserDTO, @Param('id') id: string): Promise<void> {
    return this.service.deleteById(user.id, id);
  }
}
