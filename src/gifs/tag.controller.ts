import { Controller, Get, Param } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ICurrentUserDTO } from '../auth/interfaces/current-user.interface';
import { IUserTagDTO } from './dto/user-tag-with-gifs.dto';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(
    private readonly service: TagService
  ) { }

  @Get('/')
  public async findAll(@CurrentUser() user: ICurrentUserDTO): Promise<IUserTagDTO[]> {
    return this.service.findAll(user.id);
  }

  @Get('/:id')
  public async findOne(@CurrentUser() user: ICurrentUserDTO, @Param('id') id: string): Promise<IUserTagDTO> {
    return this.service.findOneById(user.id, id);
  }
}
