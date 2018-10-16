import { Controller, Get, Param, Query } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ICurrentUserDTO } from '../auth/interfaces/current-user.interface';
import { QueryUserSourceDTO } from './dto/query-user-source.dto';
import { IUserSourceDTO } from './dto/user-source.dto';
import { SourceService } from './source.service';

@Controller('source')
export class SourceController {
  constructor(
    private readonly service: SourceService
  ) { }

  @Get('/')
  public async findAll(@CurrentUser() user: ICurrentUserDTO, @Query() query: QueryUserSourceDTO): Promise<IUserSourceDTO[]> {
    return this.service.findAllByIds(user.id, query.ids);
  }

  @Get('/:id')
  public async findOne(@CurrentUser() user: ICurrentUserDTO, @Param('id') id: string): Promise<IUserSourceDTO> {
    return this.service.findOneById(user.id, id);
  }
}
