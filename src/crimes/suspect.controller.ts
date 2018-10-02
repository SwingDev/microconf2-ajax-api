import { Controller, Get, Param, Query } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ICurrentUserDTO } from '../auth/interfaces/current-user.interface';
import { QueryUserSuspectDTO } from './dto/query-user-suspect.dto';
import { IUserSuspectDTO } from './dto/user-suspect.dto';
import { SuspectService } from './suspect.service';

@Controller('suspect')
export class SuspectController {
  constructor(
    private readonly service: SuspectService
  ) { }

  @Get('/')
  public async findAll(@CurrentUser() user: ICurrentUserDTO, @Query() query: QueryUserSuspectDTO): Promise<IUserSuspectDTO[]> {
    return this.service.findAllByIds(user.id, query.ids);
  }

  @Get('/:id')
  public async findOne(@CurrentUser() user: ICurrentUserDTO, @Param('id') id: string): Promise<IUserSuspectDTO> {
    return this.service.findOneById(user.id, id);
  }
}
